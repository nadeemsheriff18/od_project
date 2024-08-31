import express from 'express';
import cors from 'cors';
import pool from './DB/DPPG.js'; // Ensure this file exports a configured pool
import StudentRouter from './Routes/StudentRouter.js';
import ODController from './Routes/ODcontrollerRouter.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routers
app.use('/api/Student', StudentRouter);
app.use('/api/ODController', ODController);

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        await pool.query('INSERT INTO student (email, pwd) VALUES ($1, $2);', [email, hashedPassword]);
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
        res.json({ email, token });
    } catch (err) {
        console.error(err);
        res.json({ detail: err.detail });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await pool.query('SELECT * FROM student WHERE email = $1', [email]);

        if (!student.rows.length) return res.json({ detail: 'User does not exist!' });

        const success = await bcrypt.compare(password, student.rows[0].pwd);
        if (success) {
            const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' });
            res.json({ email: student.rows[0].email, token });
        } else {
            res.json({ detail: 'Invalid password!' });
        }
    } catch (err) {
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
