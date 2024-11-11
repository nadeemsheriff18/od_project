import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import pool from "../DB/DPPG.js"; // PostgreSQL connection pool
import fs from 'fs';
import path from 'path';
const __dirname =  path.resolve('C:/Users/KABELAN/Documents/GitHub/od_project/server');
console.log(`---------------------${__dirname}`)
const jsonFilePath = path.join(__dirname, 'Config', 'sections.json');
console.log(`---------------------${jsonFilePath}`)

const router = express.Router();

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const yearSections = {
//     1: ['A', 'B', 'C'],
//     2: ['A', 'B'],
//     3: ['A', 'B'],
//     4: ['A'],
//   };
// Route to handle the first-time upload (Insert students)
router.delete('/ResetPopulation', async (req, res) => {
    try {
        const result = await pool.query(`
            DELETE FROM public.student_attendance_summary 
        `);
        res.status(200).send({ message: 'Rows deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting rows.' });
    }
});
const readJsonFile = () => {
    const data = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(data);
  };
  
  // Helper function to write JSON data
  const writeJsonFile = (data) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
  };
// Fetching years and sections
router.get('/fetchingSections', (req, res) => {
    try {
      const yearSections = readJsonFile();
      res.status(200).json({ Years: yearSections });
    } catch (error) {
      console.error('Error reading the file:', error);
      res.status(500).json({ message: 'Error fetching sections' });
    }
  });
  
  // Adding a section to a specific year
  router.post('/sections', (req, res) => {
    const { year, section } = req.body;
  
    if (!year || !section) {
      return res.status(400).json({ message: 'Year and section are required' });
    }
  
    try {
      const yearSections = readJsonFile();
  
      // If the year doesn't exist, initialize it with an empty array
      if (!yearSections[year]) {
        yearSections[year] = [];
      }
  
      // Check if the section already exists in the array for that year
      if (!yearSections[year].includes(section)) {
        yearSections[year].push(section);
        yearSections[year].sort();
        writeJsonFile(yearSections);
        res.status(200).json({ message: 'Section added successfully' });
      } else if(yearSections[year].includes(section)) {
        console.log("ASDASDADDASDAS")
        res.status(409).json({ message: 'Section already exists for this year' });
      }
    } catch (error) {
      console.error('Error adding section:', error);
      res.status(500).json({ message: 'Error adding section' });
    }
  });
  
  // Removing a section from a specific year
  router.delete('/sectionsdel', (req, res) => {
    const { year, section } = req.body;
  
    if (!year || !section) {
      return res.status(400).json({ message: 'Year and section are required' });
    }
  
    try {
      const yearSections = readJsonFile();
  
      // Check if the year exists and has the specified section
      if (yearSections[year] && yearSections[year].includes(section)) {
        // Remove the section from the array
        yearSections[year] = yearSections[year].filter(sec => sec !== section);
  
        // If no sections remain, delete the year entry
        if (yearSections[year].length === 0) {
          delete yearSections[year];
        }
  
        writeJsonFile(yearSections);
        res.status(200).json({ message: 'Section removed successfully' });
      } else {
        res.status(404).json({ message: 'Section not found for this year' });
      }
    } catch (error) {
      console.error('Error removing section:', error);
      res.status(500).json({ message: 'Error removing section' });
    }
  });
router.post('/uploadInitial', upload.single('file'), async (req, res) => {
    const buffer = req.file.buffer;

    // Read and parse the Excel file
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
      header: 1,
      range: 1, // Assuming the first row is headers
    });

    // Extract student roll numbers (adjust based on your sheet structure)
    const students = data.map(row => row[2]); // Assuming roll numbers are in the third column (index 2)
    
    try {
        await insertStudents(students); // Insert students into the database
        res.status(200).send('Students uploaded successfully');
    } catch (error) {
        console.error('Error inserting students:', error);
        res.status(500).send('Error processing the file.');
    }
});

// Function to insert students into the database
const insertStudents = async (students) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // Prepare the INSERT statement with placeholders
        const values = students.map((_, index) => `($${index + 1}, 0,  0)`).join(', ');
        const query = `
            INSERT INTO public.student_attendance_summary (student_id, total_classes, absent_count) 
            VALUES ${values}
            ON CONFLICT (student_id) 
            DO NOTHING;
        `;

        // Execute the query
        await client.query(query, students);
        await client.query('COMMIT'); // Commit the transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        throw error; // Throw the error for handling in the route
    } finally {
        client.release(); // Release the client back to the pool
    }
};

// Route to handle subsequent updates (Update attendance)
router.post('/uploadExcel', upload.single('file'), async (req, res) => {
    const buffer = req.file.buffer;

    // Read and parse the Excel file
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
        header: 1,
        range: 1, // Adjust this based on where your data starts
    });

    // Assuming the third column contains student IDs
    const studentIds = data.map(row => row[2]); // Adjust based on your Excel structure

    try {
        const query = `
    UPDATE public.student_attendance_summary
    SET 
        total_classes = total_classes + 1,
        absent_count = absent_count + 
            CASE 
                WHEN student_id = ANY($1::int[]) THEN 1
                ELSE 0
            END
    WHERE student_id = ANY($1::int[]) OR student_id != ANY($1::int[]); 
`;

        // Execute the update query
        await pool.query(query, [studentIds]);

        res.status(200).send('Attendance updated successfully.');
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file.');
    }
});

export default router;
