import express from 'express';
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ODController from './Routes/ODcontrollerRouter.js';
import Student from './Routes/StudentRouter.js';
import pg from "./DB/DPPG.js";
import path from 'path';
import dotenv from 'dotenv';
import AdminControlRouter from './Routes/AdminControlRouter.js';
import os from 'os';
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// console.log(process.env.PORT);
const port = process.env.PORT|| 3001;


// Middlewares
app.use(express.json());
app.use(cors());
// const uploadsPath = path.join(os.homedir(), 'Desktop', 'uploads');
const uploadsPath = path.join(__dirname, '/uploads');
console.log(uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Routers
app.use('/api/ODController/',ODController);
app.use('/api/Student/',Student);
app.use('/api/upload/',AdminControlRouter);
//database
// const pg = new Pg.Client({
//     user: 'postgres',
//     password: '160427',
//     host: 'localhost',
//     port: 5432,
//     database: 'OD'
// })

// pg.connect()

//forgot password
// const generateToken = (email, role) => {
//     return jwt.sign({ email, role }, 'secret', { expiresIn: '1hr' });
//   };
  
// app.post('/changepwd', async (req,res)=>{
//     const {email, password}= req.body
//     const salt=bcrypt.genSaltSync(10)
//     const hashedPassword=bcrypt.hashSync(password,salt)

//     try{
//         const signUp = await pg.query(`UPDATE student_login SET hashed_pwd=($1) WHERE email=($2);`,
//             [hashedPassword,email])
//             res.json({email})    
//     }
//     catch(err){
//         console.log(err)
//         if (err) {
//             res.json({detail:err.detail})
//         }
//     }
// });


// //staff login
// app.post('/staffsignup', async (req,res)=>{
//     const {email, password}= req.body
//     const salt=bcrypt.genSaltSync(10)
//     const hashedPassword=bcrypt.hashSync(password,salt)

//     try{
//         const signUp = await pg.query(`INSERT INTO staff_login (email, hashed_password) VALUES($1, $2);`,
//             [email, hashedPassword])
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
//             res.json({email, token,"role": "admin"}) 
//     }
//     catch(err){
//         console.log(err)
//         if (err) {
//             res.json({detail:err.detail})
//         }
//     }
// });

// app.post('/stafflogin',async (req,res)=>{
//     const {email,password}= req.body
//     try{
//         const staff=await pg.query('SELECT * FROM staff_login Where email = $1', [email])

//         if(!staff.rows.length) return res.json({detail: 'User does not exist! '})

//             const success =await bcrypt.compare(password,staff.rows[0].hashed_password)
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
//             if(success){
//                 res.json({'email': staff.rows[0].email,token,"role":"admin"})
//             }
//             else{
//                 res.json({detail: 'Invalid password! '})
//             }
//     }
//     catch(err){
//         console.log(err)
//     }
// })

// //student login
// app.post('/studentsignup', async (req,res)=>{
//     const {email, password}= req.body
//     const salt=bcrypt.genSaltSync(10)
//     const hashedPassword=bcrypt.hashSync(password,salt)

//     try{
//         const signUp = await pg.query(`INSERT INTO student_login (email, hashed_pwd) VALUES($1, $2);`,
//             [email, hashedPassword])
        
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})

//             res.json({email, token,"role": "student"})
        
//     }
//     catch(err){
//         console.log(err)

//         if (err) {
//             res.json({detail:err.detail})
//         }
//     }
// });

// app.post('/studentlogin',async (req,res)=>{
//     const {email,password}= req.body
//     try{
//         const student=await pg.query('SELECT * FROM student_login Where email = $1', [email])

//         if(!student.rows.length) return res.json({detail: 'User does not exist! '})

//             const success =await bcrypt.compare(password,student.rows[0].hashed_pwd)
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
//             if(success){
//                 res.json({'email': student.rows[0].email,token,"role": "student"})
//             }
//             else{
//                 res.json({detail: 'Invalid password! '})
//             }
//     }
//     catch(err){
//         console.log(err)
//     }
// })
//  app.listen(port,()=>{
//     console.log(`server is running on port ${port}`);
//  });

//  //AHOD login
//  app.post('/ahodsignup', async (req,res)=>{
//     const {email, password}= req.body
//     const salt=bcrypt.genSaltSync(10)
//     const hashedPassword=bcrypt.hashSync(password,salt)

//     try{
//         const signUp = await pg.query(`INSERT INTO ahod_login (email, hashed_pwd) VALUES($1, $2);`,
//             [email, hashedPassword])
        
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})

//             res.json({email, token,"role": "ahod"})
        
//     }
//     catch(err){
//         console.log(err)

//         if (err) {
//             res.json({detail:err.detail})
//         }
//     }
// });
//  app.post('/ahodsignup', async (req,res)=>{
//     const {email, password}= req.body
//     const salt=bcrypt.genSaltSync(10)
//     const hashedPassword=bcrypt.hashSync(password,salt)

//     try{
//         const signUp = await pg.query(`INSERT INTO ahod_login (email, hashed_pwd) VALUES($1, $2);`,
//             [email, hashedPassword])
        
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})

//             res.json({email, token,"role": "ahod"})
        
//     }
//     catch(err){
//         console.log(err)

//         if (err) {
//             res.json({detail:err.detail})
//         }
//     }
// });

// app.post('/ahodlogin',async (req,res)=>{
//     const {email,password}= req.body
//     try{
//         const ahod=await pg.query('SELECT * FROM ahod_login Where email = $1', [email])

//         if(!ahod.rows.length) return res.json({detail: 'User does not exist! '})

//             const success =await bcrypt.compare(password,ahod.rows[0].hashed_pwd)
//             const token =jwt.sign({email}, 'secret', {expiresIn: '1hr'})
//             if(success){
//                 res.json({'email': ahod.rows[0].email,token,"role": "ahod"})
//             }
//             else{
//                 res.json({detail: 'Invalid password! '})
//             }
//     }
//     catch(err){
//         console.log(err)
//     }
// })


//////////////////////////////////////////////////////////////////////





//forgot password
app.post('/changepwd', async (req,res)=>{
    const {email, password}= req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)

    try{
        const signUp = await pg.query(`UPDATE student_login SET hashed_pwd=($1) WHERE email=($2);`,
            [hashedPassword,email])
            res.json({email})    
    }
    catch(err){
        console.log(err)
        if (err) {
            res.json({detail:err.detail})
        }
    }
});


//HOD login
app.post('/stafflogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const staff=await pg.query('SELECT * FROM staff_login Where email = $1', [email])

        if(!staff.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,staff.rows[0].hashed_password)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': staff.rows[0].email,token,"role":"admin"})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})

//staff login
app.post('/classStafflogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const staff=await pg.query('SELECT * FROM classStaff_login Where username = $1', [email])

        if(!staff.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,staff.rows[0].password)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': staff.rows[0].username,token,"role":"staff"})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})
//dc login
app.post('/dclogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const staff=await pg.query('SELECT * FROM dc_login Where username = $1', [email])

        if(!staff.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,staff.rows[0].password)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': staff.rows[0].username,token,"role":"DC"})
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
app.post('/studentlogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const student=await pg.query('SELECT * FROM student_login Where email = $1', [email])

        if(!student.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,student.rows[0].hashed_pwd)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': student.rows[0].email,token,"role": "student"})
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

 //AHOD login
app.post('/ahodlogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const ahod=await pg.query('SELECT * FROM ahod_login Where email = $1', [email])

        if(!ahod.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,ahod.rows[0].hashed_pwd)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': ahod.rows[0].email,token,"role": "ahod"})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})

app.post('/ahodlogin',async (req,res)=>{
    const {email,password}= req.body
    try{
        const ahod=await pg.query('SELECT * FROM ahod_login Where email = $1', [email])

        if(!ahod.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,ahod.rows[0].hashed_pwd)
            const token =jwt.sign({email}, 'secret', {expiresIn: '30m'})
            if(success){
                res.json({'email': ahod.rows[0].email,token,"role": "ahod"})
            }
            else{
                res.json({detail: 'Invalid password! '})
            }
    }
    catch(err){
        console.log(err)
    }
})