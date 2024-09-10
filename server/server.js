import express from 'express';
import cors from 'cors';
import Pg from 'pg';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ODController from './Routes/ODcontrollerRouter.js';
import Student from './Routes/StudentRouter.js';
import pg from "./DB/DPPG.js";
const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routers
app.use('/api/ODController/',ODController);
app.use('/api/Student/',Student);
//database
// const pg = new Pg.Client({
//     user: 'postgres',
//     password: '160427',
//     host: 'localhost',
//     port: 5432,
//     database: 'OD'
// })

// pg.connect()


//staff login
// Staff signup
app.post('/staffsignup', async (req, res) => {
    const { email, password, role } = req.body; // Assuming 'role' is included in the request body

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert staff member into database
        const signUp = await pg.query(`INSERT INTO staff_login (email, hashed_password, role) VALUES ($1, $2, $3);`,
            [email, hashedPassword, role]);

        // Generate JWT token with email and role in payload
        const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1hr' });

        res.json({ email, role, token });
    } catch (err) {
        console.error('Error signing up staff:', err);

        // Handle specific errors if needed
        if (err.code === '23505') { // Unique violation error
            res.status(400).json({ detail: 'Email already exists' });
        } else {
            res.status(500).json({ detail: 'Internal server error' });
        }
    }
});

// Staff login
app.post('/stafflogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const staff = await pg.query('SELECT * FROM staff_login WHERE email = $1', [email]);

        if (!staff.rows.length) return res.json({ detail: 'User does not exist!' });

        const success = await bcrypt.compare(password, staff.rows[0].hashed_password);
        const role = staff.rows[0].role;
        const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1hr' });

        if (success) {
            res.json({ email: staff.rows[0].email, role, token });
        } else {
            res.json({ detail: 'Invalid password!' });
        }
    } catch (err) {
        console.log(err);
    }
});


//student login
// Student signup
app.post('/studentsignup', async (req, res) => {
    const { email, password } = req.body;
    const role = 'student'; // Assuming all students have the role 'student'
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const signUp = await pg.query(`INSERT INTO student_login (email, hashed_pwd, role) VALUES($1, $2, $3);`,
            [email, hashedPassword, role]);

        const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1hr' });

        res.json({ email, role, token });
    } catch (err) {
        console.log(err);

        if (err) {
            res.json({ detail: err.detail });
        }
    }
});

// Student login
app.post('/studentlogin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await pg.query('SELECT * FROM student_login WHERE email = $1', [email]);

        if (!student.rows.length) return res.json({ detail: 'User does not exist!' });

        const success = await bcrypt.compare(password, student.rows[0].hashed_pwd);
        const role = student.rows[0].role;
        const token = jwt.sign({ email, role }, 'secret', { expiresIn: '1hr' });

        if (success) {
            res.json({ email: student.rows[0].email, role, token });
        } else {
            res.json({ detail: 'Invalid password!' });
        }
    } catch (err) {
        console.log(err);
    }
});

 app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 });