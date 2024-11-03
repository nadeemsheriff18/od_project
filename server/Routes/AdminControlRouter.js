import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import pool from "../DB/DPPG.js"; // PostgreSQL connection pool

const router = express.Router();

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
