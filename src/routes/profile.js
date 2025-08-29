const express=require('express');
const profileRouter=express.Router();
const {userauth}=require('../middlewares/auth');
const userModel=require('../models/user');
const isEditAllowed=require('../validations/validators');

profileRouter.get("/profile/view",userauth,async (req,res)=>{
    try{
        res.send(req.person);
    }
    catch(err){
    res.status(400).send("ERROR : "+err.message );
}
    })


profileRouter.post("/profile/edit", userauth, async (req, res) => {
    if (!isEditAllowed(req)) {
        return res.status(400).json({ error: "Edit not allowed" });
    }
    try {
        const user = req.person;
        Object.keys(req.body).forEach(key => {
            user[key] = req.body[key];
        });
        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

module.exports=profileRouter;