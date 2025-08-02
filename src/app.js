const express=require('express')
const app=express();

const {connection}=require('./config/database');

const userModel=require('./models/user');

app.post('/signup',async (req,res)=>{
    const user={
        firstName:"Praval",
        lastName:"Raghuvanshi",
        email:"abc@gmail.com",
        password:"45s43",
        usess:"sdfsdf"

    };
    const users=new userModel(user);
    await users.save();
    res.send("user added successfully");

})



connection().
then(()=>{
    console.log("Database connected");
    app.listen(7777,()=>{
        console.log("server is listening");
    })
}).catch((err)=>{
    console.log("database not connected")
})


