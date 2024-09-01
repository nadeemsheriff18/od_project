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
app.post('/staffsignup', async (req,res)=>{
    const {email, password}= req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)

    try{
        const signUp = await pg.query(`INSERT INTO staff_login (email, hashed_password) VALUES($1, $2);`,
            [email, hashedPassword])
        
            const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})

            res.json({email, token})
        
    }
    catch(err){
        console.log(err)

        if (err) {
            res.json({detail:err.detail})
        }
    }
});

app.post('/stafflogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const staff=await pg.query('SELECT * FROM staff_login Where email = $1', [email])

        if(!staff.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,staff.rows[0].hashed_password)
            const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
            if(success){
                res.json({'email': staff.rows[0].email,token})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})

//student login
app.post('/studentsignup', async (req,res)=>{
    const {email, password}= req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)

    try{
        const signUp = await pg.query(`INSERT INTO student_login (email, hashed_pwd) VALUES($1, $2);`,
            [email, hashedPassword])
        
            const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})

            res.json({email, token})
        
    }
    catch(err){
        console.log(err)

        if (err) {
            res.json({detail:err.detail})
        }
    }
});

app.post('/studentlogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const student=await pg.query('SELECT * FROM student_login Where email = $1', [email])

        if(!student.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,student.rows[0].hashed_pwd)
            const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
            if(success){
                res.json({'email': student.rows[0].email,token})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})
 app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
 });