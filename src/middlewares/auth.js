const jwt=require('jsonwebtoken');  
const userModel=require('../models/user');

const userauth=async (req,res,next)=>{
   try{
    const {token}=req.cookies;
    if(!token){
        throw new Error("Invalid token");
    }
    const decodedObj= jwt.verify(token,"Pravale44d3");
    const {_id}=decodedObj;
    const users=await userModel.findById({_id:_id});
        if(!users){
            throw new Error("user no longer availbale || token expired")
        }
        req.person=users;
    next();
   }
   catch(err){
    res.status(400).send("ERR : "+err.message);
   }
}

module.exports={userauth};