import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool
import multer from "multer";
import { fileURLToPath } from 'url'; 
// import fs from 'fs';
import path from 'path';
import os from 'os';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadsDir = path.join(os.homedir(), 'Desktop', 'uploads');

//         // Check if the uploads directory exists, if not, create it
//         fs.access(uploadsDir, fs.constants.F_OK, (err) => {
//             if (err) {
//                 fs.mkdir(uploadsDir, { recursive: true }, (err) => {
//                     if (err) {
//                         return cb(new Error('Failed to create upload directory'));
//                     }
//                     cb(null, uploadsDir);
//                 });
//             } else {
//                 cb(null, uploadsDir);
//             }
//         });
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
//     }
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const uploadPath = path.join(os.homedir(), 'Desktop', 'uploads');
        console.log(__dirname);
        const uploadPath = path.join(__dirname, '../uploads');
        cb(null, uploadPath); // Specify your uploads directory on the desktop
    },
    filename: (req, file, cb) => {
        const filePath = `${req.body.rollnumber}__${Date.now()}__${file.originalname}`;
        console.log(filePath);
        cb(null, filePath); // Set the filename
        req.filePath = path.join('uploads', filePath); // Store relative path for database
    }
});

const upload = multer({ storage }); 
router.post('/submitOD', upload.single('file'), async (req, res) => {
    const { RegNo, requestType, reason, endDate, subject, startDate, formattedDate } = req.body;
    console.log('Request Body:', req.body); // Log the request body to verify data
    console.log('Uploaded File:', req.filePath);
    // const filePath = req.file ? req.file.path : null; // Get the file path from the uploaded file
    const filePath = req.filePath;
    console.log(RegNo, requestType, reason, endDate, subject, startDate, formattedDate, filePath); // Log the data

    try {
        const query = `
            INSERT INTO public."OdReqTable"(
                "RegNo", "Type", "Reason", "EndDate", "Subject", "StartDate", "ReqDate", "FilePath")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;

        await pool.query(query, [RegNo, requestType, reason, endDate, subject, startDate, formattedDate, filePath]); // Insert into the database
        res.status(200).send('Request submitted successfully'); // Send success response
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Internal server error'); // Send error response
    }
});
// router.post('/submitOD', async (req, res) => {
//     const { RegNo, requestType, reason, endDate, subject, startDate , formattedDate  } = req.body;
//     console.log(RegNo, requestType, reason, endDate, subject, startDate , formattedDate );
//     try {
//         console.log(req.body)
//         const query = `
//             INSERT INTO public."OdReqTable"(
//                 "RegNo", "Type", "Reason", "EndDate", "Subject", "StartDate" , "ReqDate")
//             VALUES ($1, $2, $3, $4, $5, $6 ,$7);
//         `;

//         await pool.query(query, [RegNo, requestType, reason, endDate, subject, startDate , formattedDate]);
//         res.status(200).send('Request submitted successfully');
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         res.status(500).send('Internal server error');
//     }
// });

 router.get(`/history/StuHistory/:rollno`, async(req,res)=>{
     const {rollno} = req.params;
     console .log(rollno)
     try {
         const query = `
           SELECT 
    a."Type", 
    a."Reason", 
    a."EndDate", 
    a."Subject", 
    a."StartDate", 
    a."ReqDate", 
    a.id,
    a."Astatus",
    a."AHOD_accept",
    COALESCE(c."OD", 0) AS "OD",
    COALESCE(c."Permission", 0) AS "Permission",
    COALESCE(c."Leave", 0) AS "Leave",
    a."FilePath"
FROM public."OdReqTable" AS a
JOIN public."student" AS b 
    ON a."RegNo" = b."rollno"
LEFT JOIN public."ODsummary" AS c 
    ON a."RegNo" = c."RegNo"
WHERE a."RegNo" = $1
ORDER BY a."Astatus" DESC ,a."AHOD_accept" DESC;
         `;
         const result = await pool.query(query, [rollno]);
          // Log the result
          console.log(result.rows)
         res.status(200).json(result.rows);
       } catch (err) {
         console.error('Error fetching data:', err);
         res.status(500).send('Internal server error');
       }
 })

router.delete('/history/deleteReq',async(req,res)=>{
    const { id} = req.query; 
    console.log(id)
    if (!id ) {
        return res.status(400).json({ error: 'ID and RegNo are required' });
    }
    try {
        const deleteQuery = `
            DELETE FROM public."OdReqTable"
            WHERE id = $1 
            RETURNING *;
        `;
        
        const result = await pool.query(deleteQuery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        console.log(result)
        res.status(200).json({
            message: 'Record deleted successfully',
            deletedRecord: result.rows[0], // Returns the deleted record for confirmation
        });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'An error occurred while deleting the record' });
    }
} );

router.get('/:email', async (req, res) => {
    const email = req.params.email;
    console.log(`Fetching data for email: ${email}`);

    try {
        const query = `SELECT a.stud_name, a.rollno, a.department, a.cgpa, a.year, a.sem, a.sec,
        COALESCE(c."OD", 0) AS "OD",
        COALESCE(c."Permission", 0) AS "Permission",
        COALESCE(c."Leave", 0) AS "Leave",
     COALESCE(d.total_classes, 0) AS total_classes,
    COALESCE(d.absent_count, 0) AS absent_count
                        FROM public."student" as a 
                        LEFT JOIN public."ODsummary" AS c 
                        ON a."rollno" = c."RegNo"
                        LEFT JOIN public."student_attendance_summary" AS d
                        ON a."rollno" = d."student_id"
                        WHERE a.email = $1`;  
         
        const result = await pool.query(query, [email]);
        
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            console.log('Student not found');
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
