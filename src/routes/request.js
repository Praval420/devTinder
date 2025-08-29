const express=require('express');
const connReq=express.Router();
const userConnection=require('../models/connectionRequest');
const userModel=require('../models/user')
const { userauth } = require('../middlewares/auth');

connReq.post('/request/send/:status/:userId', userauth, async (req, res) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.userId;
    const fromUserId = req.person._id;

    const isUserIdThere = await userModel.findById(toUserId);
    const isDuplicate=await userConnection.find({
        $or:[{toUserId:fromUserId,fromUserId:toUserId},
            {toUserId,fromUserId}
        ]
    })

   if (!isUserIdThere || isUserIdThere._id.equals(fromUserId) || isDuplicate.length > 0) {
  console.log(isDuplicate);
  throw new Error("User not found or self connection or duplicate connection");
}


    const user = new userConnection({
      toUserId,
      fromUserId,
      status,
    });

    await user.save();

    res.status(201).json({ message: "Connection "+ status }); 

  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});



module.exports=connReq;