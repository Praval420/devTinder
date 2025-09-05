const mongoose=require('mongoose');
const paymentSchema=new mongoose.Schema({
    orderId:{type:String,required:true},
    paymentId:{type:String},
    signature:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    amount:{type:Number,required:true}, 
    currency:{type:String,required:true},
    notes:{
        firstName:{type:String},
        lastName:{type:String},
        emailId:{type:String},
        membershipType:{type:String}
        
    },
    status:{type:String,default:"pending",required:true },
    createdAt:{type:Date,default:Date.now},
    }
);
const paymentModel=mongoose.model('Payment',paymentSchema);
module.exports=paymentModel; 