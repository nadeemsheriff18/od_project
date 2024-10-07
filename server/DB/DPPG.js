import pkg from 'pg';  // Import the entire 'pg' module as a default import
const { Pool } = pkg;

//!!!!!!!!! Unthula work pandra apo . entha comment out paniko !!!!!!!!!!!!!!!!!!!!!!!!
//KABI
{/*
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "OD",
    password: "k1062005",
    port: 5432,          
    
});
*/}
//Nadeem
 const pool = new Pool({
         user: 'postgres',
         password: '160427',
           host: 'localhost',
           port: 5432,
          database: 'OD'
       });

// Export the pool instance
export default pool;