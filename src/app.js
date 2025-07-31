const express=require('express')
const app=express();
 const {authenticate}=require('./middlewares/admin');

 const {connection}=require('./config/database');

connection().
then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
        console.log("server is listening");
    })
}).catch((err)=>{
    console.log("database not connected")
})

app.get("/user/auth",authenticate);

app.get("/user",(req,res,next)=>{
//    throw new Error("some error")
    next();
},(req,res)=>{
    res.send("2nd response");
})

app.post("/user",(req,res)=>{
    res.send("post successfully executed");
})

app.use('/',(err,req,res,next)=>{
    res.status(500).send("some error occrred");
})

