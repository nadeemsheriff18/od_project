import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool

router.get('/fetchOD', async (req, res) => {
    try {
        console.log("ADAS")
        const query = `SELECT 
    a."RegNo", 
    a."Type", 
    a."Reason", 
    a."EndDate", 
    a."Subject", 
    a."StartDate",
    a."ReqDate", 
    a.id, 
    a."Astatus",
    b.email,
    b.stud_name, 
    b.department, 
    b.cgpa,
    b.year, 
    b.sem, 
    b.sec, 
    b."Attendence", 
    COALESCE(c."OD", 0) AS "OD",
    COALESCE(c."Permission", 0) AS "Permission"
FROM public."OdReqTable" AS a
JOIN public."student" AS b 
ON a."RegNo" = b."rollno"
LEFT JOIN public."ODsummary" AS c 
ON a."RegNo" = c."RegNo"
WHERE a."Astatus" = 0;
`;
        const result = await pool.query(query);
        res.status(200).json(result.rows); // Send the result rows as JSON
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal server error');
    }
});

export default router;
