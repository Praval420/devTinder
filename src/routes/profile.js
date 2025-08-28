const express=require('express');
const profileRouter=express.Router();
const {userauth}=require('../middlewares/auth');
const userModel=require('../models/user');


profileRouter.get("/profile",userauth,async (req,res)=>{
    try{
        res.send(req.person);
    }
    catch(err){
    res.status(400).send("ERROR : "+err.message );
}
    })

profileRouter.get("/feed",async (req,res)=>{
    const mail=req.body.emailId;
    const users=await userModel.find({emailId:mail});
    if(users.length!=0){
        res.send(users);
    }
    else{
        res.send("something went wrong");
    }
})

module.exports=profileRouter;