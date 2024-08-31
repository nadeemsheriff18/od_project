import express from 'express';
import cors from 'cors';
import Pg from 'pg';

const app = express();
const port = 3001;

app.use(express.json())
app.use(cors())

// const pg = new Pg.Client({
//     user: 'postgres',
//     password: '160427',
//     host: 'localhost',
//     port: 5432,
//     database: 'OD'
// })
// pg.connect()

app.post('/signup', async (req,res)=>{
    const {email, password}= req.body
    const salt=bcrypt.genSaltSync(10)
    const hashedPassword=bcrypt.hashSync(password,salt)

    try{
        const signUp = await pg.query(`INSERT INTO student (email, pwd) VALUES($1, $2);`,
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
})



app.post('/login',async (req,res)=>{
    const {email,password}= req.body
    try{
        const student=await pg.query('SELECT * FROM student Where email = $1', [email])

        if(!student.rows.length) return res.json({detail: 'User does not exist! '})

            const success =await bcrypt.compare(password,student.rows[0].pwd)
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