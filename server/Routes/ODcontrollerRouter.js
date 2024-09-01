import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool

router.get('/fetchOD', async (req, res) => {
    try {
        console.log("ADAS")
        const query = 'SELECT * FROM public."OdReqTable"';
        const result = await pool.query(query);
        res.status(200).json(result.rows); // Send the result rows as JSON
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal server error');
    }
});

export default router;
