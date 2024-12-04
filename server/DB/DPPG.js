import pkg from 'pg';  // Import the entire 'pg' module as a default import
const { Pool } = pkg;
import cron from 'node-cron';

//!!!!!!!!! Unthula work pandra apo . entha comment out paniko !!!!!!!!!!!!!!!!!!!!!!!!
//KABI

//const pool = new Pool({
//    user: "postgres",
//    host: "localhost",
//    database: "OD",
//    password: "k1062005",
//    port: 5432,          
//    
//});

//Nadeem
 const pool = new Pool({
         user: 'postgres',
         password: '160427',
           host: 'localhost',
            port: 5432,
         database: 'OD'
      });

// Export the pool instance
// const updateExpiredRecords = async () => {
//   try {
//       // Select records where the EndDate has passed
//       const selectQuery = `
//           SELECT id, "Astatus"
//           FROM public."OdReqTable"
//           WHERE "EndDate" < CURRENT_DATE;
//       `;

//       const { rows: expiredRecords } = await pool.query(selectQuery);

//       if (expiredRecords.length > 0) {
//           // Prepare update statements
//           const updates = expiredRecords.map(record => {
//               let newStatus;

//               // Determine new status based on existing Astatus
//               if (record.Astatus === -1) {
//                   newStatus = -10;
//               } else if (record.Astatus === 1) {
//                   newStatus = -20;
//               } else {
//                   newStatus = -30;
//               }

//               return { id: record.id, newStatus };
//           });

//           // Batch update records
//           const updateQuery = `
//               UPDATE public."OdReqTable"
//               SET "Astatus" = CASE id
//                   ${updates.map(update => `WHEN ${update.id} THEN '${update.newStatus}'`).join(' ')}
//                   END
//               WHERE id IN (${updates.map(update => update.id).join(', ')});
//           `;

//           await pool.query(updateQuery);
//           console.log(`Updated ${updates.length} expired records.`);
//       } else {
//           console.log('No expired records found.');
//       }
//   } catch (error) {
//       console.error('Error updating expired records:', error);
//   }
// }
async function updateExpiredRecords() {
  try {
    // Query to update expired records
    const query = `
      UPDATE public."OdReqTable"
      SET "Astatus" = CASE
        WHEN "Astatus" = 1 THEN -21
        WHEN "Astatus" = -1 THEN -19
        ELSE -20
      END
      WHERE "EndDate" < CURRENT_DATE;
    `;

    const result = await pool.query(query);
    console.log(`Updated ${result.rowCount} expired records.`);
  } catch (error) {
    console.error('Error updating expired records:', error);
  }
}

// Schedule the job to run every 10 seconds
// cron.schedule('*/10 * * * * *', () => {
//   console.log('Running the updateExpiredRecords job...');
//   updateExpiredRecords();
// });
// ;



// Export the pool instance for other database operations
export default pool;