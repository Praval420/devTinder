const express=require('express')

const app=express();
const {connection}=require('./config/database');
const cookieParser=require('cookie-parser')  



app.use(express.json());
app.use(cookieParser());

const authRouter=require('./routes/auth');  
const profileRouter=require('./routes/profile');

app.use('/',authRouter);
app.use('/',profileRouter);




connection().
then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
        console.log("server is listening");
    })
}).catch((err)=>{
    console.log("database not connected")
})


