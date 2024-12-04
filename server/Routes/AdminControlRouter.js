import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import pool from "../DB/DPPG.js"; // PostgreSQL connection pool
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the directory of the current file dynamically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to sections.json
const jsonFilePath = path.join(__dirname, '../Config/sections.json');

console.log(`Resolved JSON file path: ${jsonFilePath}`);

// Configure multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to read JSON data
const readJsonFile = () => {
  const data = fs.readFileSync(jsonFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write JSON data
const writeJsonFile = (data) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Route to reset population
router.delete('/ResetPopulation', async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM public.student_attendance_summary`);
    res.status(200).send({ message: 'Rows deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting rows.' });
  }
});

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

    if (!yearSections[year]) {
      yearSections[year] = [];
    }

    if (!yearSections[year].includes(section)) {
      yearSections[year].push(section);
      yearSections[year].sort();
      writeJsonFile(yearSections);
      res.status(200).json({ message: 'Section added successfully' });
    } else {
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

    if (yearSections[year] && yearSections[year].includes(section)) {
      yearSections[year] = yearSections[year].filter(sec => sec !== section);

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

// Upload initial students
router.post('/uploadInitial', upload.single('file'), async (req, res) => {
  const buffer = req.file.buffer;

  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
    header: 1,
    range: 1,
  });

  const students = data.map(row => row[2]);

  try {
    await insertStudents(students);
    res.status(200).send('Students uploaded successfully');
  } catch (error) {
    console.error('Error inserting students:', error);
    res.status(500).send('Error processing the file.');
  }
});

// Insert students into database
const insertStudents = async (students) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const values = students.map((_, index) => `($${index + 1}, 0, 0)`).join(', ');
    const query = `INSERT INTO public.student_attendance_summary (student_id, total_classes, absent_count) VALUES ${values} ON CONFLICT (student_id) DO NOTHING;`;
    await client.query(query, students);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Upload Excel and update attendance
router.post('/uploadExcel', upload.single('file'), async (req, res) => {
  const buffer = req.file.buffer;
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {
    header: 1,
    range: 1,
  });

  const studentIds = data.map(row => row[2]);

  try {
    const query = `
      UPDATE public.student_attendance_summary
      SET 
        total_classes = total_classes + 1,
        absent_count = absent_count + CASE WHEN student_id = ANY($1::int[]) THEN 1 ELSE 0 END
      WHERE student_id = ANY($1::int[]) OR student_id != ANY($1::int[]);
    `;
    await pool.query(query, [studentIds]);
    res.status(200).send('Attendance updated successfully.');
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file.');
  }
});

export default router;
