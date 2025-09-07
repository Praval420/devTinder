const express = require("express");
const chatRouter = express.Router();
const {userauth}=require('../middlewares/auth');
const Chat=require('../models/chat');


chatRouter.get("/chat/:targetUserId",userauth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId  = req.person._id;
    console.log(userId,targetUserId);
    try{
    let user= await Chat.findOne({
                participants:{$all:[userId,targetUserId]},
            }).populate({path:"messages.senderId",
                select:"firstName lastName"});
    
            if(!user){
                user=new Chat({
                    participants:[userId,targetUserId],
                    messages:[],
                });
                 await user.save();
            }
            
           res.json(user);
        }catch(err){
            res.status(400).send("ERROR : "+err.message );
        }

});




module.exports = chatRouter;