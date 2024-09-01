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

export default router;
