const express=require('express')

const app=express();
const {connection}=require('./config/database');
const cookieParser=require('cookie-parser')  



app.use(express.json());
app.use(cookieParser());

const authRouter=require('./routes/auth');  
const profileRouter=require('./routes/profile');
const connReq=require('./routes/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connReq);




connection().
then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
        console.log("server is listening");
    })
}).catch((err)=>{
    console.log("database not connected")
})


