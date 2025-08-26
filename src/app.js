const express=require('express')
const app=express();

const {connection}=require('./config/database');

const userModel=require('./models/user');

app.use(express.json());

app.post('/signup',async (req,res)=>{
    console.log(req.body);
    const user={
        firstName:"Praval",
        lastName:"Raghuvanshi",
        emailId:"abc@gmail.com",
        password:"45s43",
        usess:"sdfsdf"

    };
    const users=new userModel(user);
    await users.save();
    res.send("user added successfully");

})

app.get("/feed",async (req,res)=>{
    const mail=req.body.email;
    const users=await userModel.find({emailId:mail});
    if(users.length!=0){
        res.send(users);
    }
    else{
        res.send("something went wrong");
    }
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


