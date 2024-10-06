// backend/routes/ODController.js

import express from 'express';
const router = express.Router();
import pool from '../DB/DPPG.js'; // Ensure this file exports a configured pool

// Fetch requests based on the active tab
// Fetch requests based on the active tab for HOD
router.get('/fetchOD/:activeTab', async (req, res) => {
  const status = req.params.activeTab === 'odRequest' ? 0 : 1; // Determine if fetching requests or closed requests
  const { year, section } = req.query;
  console.log('Year:', year, 'Section:', section); // Log to verify

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
        COALESCE(c."OD", 0) AS "OD",
        COALESCE(c."Permission", 0) AS "Permission",
		COALESCE(d.total_classes, 0) AS total_classes,
    COALESCE(d.absent_count, 0) AS absent_count
      FROM public."OdReqTable" AS a
      JOIN public."student" AS b 
        ON a."RegNo" = b."rollno"
      LEFT JOIN public."ODsummary" AS c 
        ON a."RegNo" = c."RegNo"
		LEFT JOIN public."student_attendance_summary" AS d
    ON b."rollno" = d."student_id"
      WHERE a."AHOD_accept" = -1 
        AND a."Astatus" = $1
        AND b.year =$2 
        AND b.sec = $3;
		
		 -- Only show requests accepted by AHOD
    `;
    const result = await pool.query(query, [status, year, section]);
     // Log the result
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal server error');
  }
});


// Update Astatus and OD/Permissions based on RegNo
// Update Astatus and OD/Permissions based on RegNo (for Accept/Decline by HOD)
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

    // Update Astatus (Accept = 1, Decline = -1)
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
      return res.status(404).json({ message: 'Request not found' });
    }

    // If declined (status === -1), no OD/Permission count updates
    if (status === -1) {
      // Just update the Astatus to -1, no further changes needed for counts
      await client.query('COMMIT');
      return res.status(200).json({ message: 'Request declined successfully' });
    }

    // Continue with OD or Permission count update only if accepted (status === 1)
    let updateCountQuery = '';
    if (Type === 'permission' && status === 1) {
      updateCountQuery = `
        UPDATE public."ODsummary" 
        SET "Permission" = "Permission" + 1 
        WHERE "RegNo" = $1;
      `;
    } else if (Type === 'on-duty' && status === 1) {
      updateCountQuery = `
        UPDATE public."ODsummary" 
        SET "OD" = "OD" + 1 
        WHERE "RegNo" = $1;
      `;
    }

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




// Fetch OD requests pending AHOD approval
router.get('/ahod/fetchPending', async (req, res) => {
  const { year, section } = req.query; // Retrieve year and section from the query parameters

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
        COALESCE(c."OD", 0) AS "OD",
        COALESCE(c."Permission", 0) AS "Permission",
		COALESCE(d.total_classes, 0) AS total_classes,
    COALESCE(d.absent_count, 0) AS absent_count
      FROM public."OdReqTable" AS a
      JOIN public."student" AS b 
        ON a."RegNo" = b."rollno"
      LEFT JOIN public."ODsummary" AS c 
        ON a."RegNo" = c."RegNo"
		LEFT JOIN public."student_attendance_summary" AS d
    ON b."rollno" = d."student_id"
      WHERE a."AHOD_accept" = -1 
        AND a."Astatus" = 0
        AND b.year =$1 
        AND b.sec = $2; -- Filter by year and section
    `;
    
    const result = await pool.query(query, [year, section]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal server error');
  }
});

// Update AHOD approval status
router.patch('/ahod/updateStatus', async (req, res) => {
  const { id, RegNo, status } = req.body; // status = 1 (accept), 0 (decline)

  try {
    const updateQuery = `
      UPDATE public."OdReqTable" 
      SET "AHOD_accept" = $1
      WHERE "RegNo" = $2 AND id = $3;
    `;
    await pool.query(updateQuery, [status, RegNo, id]);

    res.status(200).json({ message: 'AHOD approval updated successfully' });
  } catch (err) {
    console.error('Error updating AHOD approval:', err);
    res.status(500).send('Internal server error');
  }
});



export default router;
