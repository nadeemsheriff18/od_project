// backend/routes/ODController.js

import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool

// Fetch requests based on the active tab
router.get('/fetchOD/:activeTab', async (req, res) => {
  const status = req.params.activeTab === 'odRequest' ? 0 : 1;
  try {
    const query = `
      SELECT 
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
      WHERE a."Astatus" = $1 ;
    `;
    const result = await pool.query(query, [status]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal server error');
  }
});

// Update Astatus and OD/Permissions based on RegNo
router.patch('/updateStatus', async (req, res) => {
  const { id, RegNo, status, isRequestTab } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch the request type (Permission or On-Duty)
    const fetchTypeQuery = `
      SELECT "Type" FROM public."OdReqTable" 
      WHERE "RegNo" = $1 AND id = $2;
    `;
    const fetchTypeResult = await client.query(fetchTypeQuery, [RegNo, id]);
      
    if (fetchTypeResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Record not found' });
    }

    const { Type } = fetchTypeResult.rows[0];
    console.log(Type);
    // Update Astatus
    const updateStatusQuery = `
      UPDATE public."OdReqTable" 
      SET "Astatus" = $1 
      WHERE "RegNo" = $2 AND id = $3
      RETURNING *;
    `;
    const updateStatusValues = [status, RegNo, id];
    const statusResult = await client.query(updateStatusQuery, updateStatusValues);

    if (statusResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Record not found' });
    }

    // Determine how to update OD or Permission counts
    let updateCountQuery = '';

    if (Type === 'permission') {
      if (isRequestTab && status === 1) {
        // Accepted: Increase Permission count
        updateCountQuery = `
          UPDATE public."ODsummary" 
          SET "Permission" = "Permission" + 1 
          WHERE "RegNo" = $1;
        `;
      } else if (!isRequestTab && status === -1) {
        // Closed: Decrease Permission count
        updateCountQuery = `
          UPDATE public."ODsummary" 
          SET "Permission" = "Permission" - 1 
          WHERE "RegNo" = $1;
        `;
      }
    } else if (Type === 'on-duty') {
      if (isRequestTab && status === 1) {
        // Accepted: Increase OD count
        updateCountQuery = `
          UPDATE public."ODsummary" 
          SET "OD" = "OD" + 1 
          WHERE "RegNo" = $1;
        `;
      } else if (!isRequestTab && status === -1) {
        // Closed: Decrease OD count
        updateCountQuery = `
          UPDATE public."ODsummary" 
          SET "OD" = "OD" - 1 
          WHERE "RegNo" = $1;
        `;
      }
    }

    // Execute count update if applicable
    if (updateCountQuery) {
      const countResult = await client.query(updateCountQuery, [RegNo]);
      if (countResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `${Type} count not updated` });
      }
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Status and count updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
