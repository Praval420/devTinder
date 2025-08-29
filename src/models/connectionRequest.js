const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fromUserId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',

    },
    status:{
        type:String,
        required:true,

        enum:{
            values:["ignore","accepted","rejected","interested"],
            message:`{VALUE} is incorrect status type`,
        },
    }


},
{
    timestamps:true,
})

const userConnection=mongoose.model("ConnectionRequest",userSchema);
module.exports=userConnection;