const express=require('express');
const userConnection=require('../models/connectionRequest');
const { userauth } = require('../middlewares/auth');
const userModel=require('../models/user');
const userRoute=express.Router();

userRoute.get('/user/requests/received',userauth,async (req,res)=>{
try{
    const loggedInUser=req.person;
    const connectionRequests=await userConnection.find({
        toUserId:loggedInUser._id,
        status:"interested",
    }).populate('fromUserId','firstName lastName');

    res.json({
        message:"Data fetched Successfully",
        data:connectionRequests,
    });
}
catch(err){
    res.json({
        message:err,
    })
}
})


userRoute.get('/user/requests/connections',userauth,async (req,res)=>{
try{
    const loggedInUser=req.person;
    const users=await userConnection.find({
        status:"accepted",
        $or:[{toUserId:loggedInUser._id},{fromUserId:loggedInUser._id}],
    }).populate('toUserId',"firstName lastName").populate('fromUserId',"firstName lastName");


const data = users.map((row) => {
  if (row.toUserId.toString() === loggedInUser._id.toString()) {
    return row.fromUserId;   
  } else {
    return row.toUserId;    
  }
});
res.json({data});
}
catch(err){
    res.json({
        message:err,
    })
}
})

userRoute.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.person;

    // Find all connection requests where the logged-in user is involved
    const connectionRequests = await userConnection.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId");

   
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
    
      if (req.fromUserId.toString() === loggedInUser._id.toString()) {
        hideUsersFromFeed.add(req.toUserId.toString());
      } else {
        hideUsersFromFeed.add(req.fromUserId.toString());
      }
    });

    const users = await userModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select('firstName lastName');

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports=userRoute;

