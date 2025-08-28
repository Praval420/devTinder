const express=require('express')

const app=express();
const {connection}=require('./config/database');
const bcrypt = require('bcrypt');
const cookieParser=require('cookie-parser')  
const userModel=require('./models/user');
const {userauth}=require('./middlewares/auth');
const jwt=require('jsonwebtoken');


app.use(express.json());
app.use(cookieParser());

app.post('/signup',async (req,res)=>{
    const {firstName,lastName,emailId,password}=req.body;
    const pass1= await bcrypt.hash(password,10);
    const user={
        firstName,
        lastName,
        emailId,
        password:pass1,
    };
    const users=new userModel(user);
    await users.save();
    res.send("user added successfully");

})

app.post("/login",async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        const user=await userModel.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            const token=await jwt.sign({_id:user._id},"Pravale44d3");
            console.log(token);
            res.cookie("token",token);
            res.send("login successfully");
        }
        else{
            throw new Error("Invalid Credentials");
        }

    }
catch(err){
    res.status(400).send("ERROR : "+err.message );
}
});

app.get("/profile",userauth,async (req,res)=>{
    try{
        res.send(req.person);
    }
    catch(err){
    res.status(400).send("ERROR : "+err.message );
}
    })

app.get("/feed",async (req,res)=>{
    const mail=req.body.emailId;
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


