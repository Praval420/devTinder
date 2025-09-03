const express=require('express');
const bcrypt = require('bcrypt');
const userModel=require('../models/user');
const jwt=require('jsonwebtoken');
const authRouter=express.Router();
const {userauth}=require('../middlewares/auth')
authRouter.post('/signup',async (req,res)=>{
    const {firstName,lastName,emailId,password}=req.body;
    const pass1= await bcrypt.hash(password,10);
    const user={
        firstName,
        lastName,
        emailId,
        password:pass1,
    };
    const users=new userModel(user);
    const data=await users.save();
    const token=await jwt.sign({_id:users._id},"Pravale44d3");
            console.log(token);
            res.cookie("token",token);
    res.json({message:"successful signup",data:data});
    

})

authRouter.post("/login",async (req,res)=>{
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
            res.send(user);
        }
        else{
            throw new Error("Invalid Credentials");
        }

    }
catch(err){
    res.status(400).send("ERROR : "+err.message );
}
});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("user logged out");
})


module.exports=authRouter;