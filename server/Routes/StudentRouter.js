import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool

router.post('/submitOD', async (req, res) => {
    const { RegNo, requestType, reason, endDate, subject, startDate , formattedDate  } = req.body;

    try {
        console.log(req.body)
        const query = `
            INSERT INTO public."OdReqTable"(
                "RegNo", "Type", "Reason", "EndDate", "Subject", "StartDate" , "ReqDate")
            VALUES ($1, $2, $3, $4, $5, $6 ,$7);
        `;

        await pool.query(query, [RegNo, requestType, reason, endDate, subject, startDate , formattedDate]);
        res.status(200).send('Request submitted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Internal server error');
    }
});

router.get(`/history/StuHistory/${rollno}`, async(req,res)=>{
    const {rollno} = req.params; 
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
            b.department,
            COALESCE(c."OD", 0) AS "OD",
            COALESCE(c."Permission", 0) AS "Permission",
          FROM public."OdReqTable" AS a
          JOIN public."student" AS b 
            ON a."RegNo" = b."rollno"
          LEFT JOIN public."ODsummary" AS c 
            ON a."RegNo" = c."RegNo"
          WHERE a."RegNo" = 1$
        `;
        const result = await pool.query(query, [rollno]);
         // Log the result
        res.status(200).json(result.rows);
      } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal server error');
      }
})

router.get('/:email', async (req, res) => {
    const email = req.params.email;
    console.log(`Fetching data for email: ${email}`);

    try {
        const query = 'SELECT * FROM student WHERE email = $1';
        const values = [email];
        
        const result = await pool.query(query, values);
        
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
