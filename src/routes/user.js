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
    }).populate('fromUserId','firstName lastName photoURL');

    res.json({
        data: connectionRequests.map(req => req.fromUserId),
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
    }).populate('toUserId',"firstName lastName emailId age about photoURL").populate('fromUserId',"firstName lastName emailId age about photoURL");


const data = users.map((row) => {
  if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
    return row.fromUserId;
  } else {
    return row.toUserId;
  }
});

res.json({data:data});
}
catch(err){
    res.json({
        message:err,
    })
}
});

userRoute.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.person;
    const page=req.query.page || 1;
    const limit=req.query.limit || 10;
    const skips=(page-1)*limit;
    if(limit>100){
        limit=100;
    }
   
    const connectionRequests = await userConnection.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId");

   
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
    
      if (req.fromUserId._id.toString() === loggedInUser._id.toString()) {
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
    }).select('firstName lastName photoURL').skip(skips).limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports=userRoute;

