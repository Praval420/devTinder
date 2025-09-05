const express=require('express');
const { userauth } = require('../middlewares/auth');
const paymentRouter=express.Router();
const razorpayInstance=require('../utils/razorpay');
const Payment=require('../models/payment');
const { MembershipType } = require('../utils/constant');
const {validateWebhookSignature}=require('razorpay/dist/utils/razorpay-utils');
const userModel = require('../models/user');



paymentRouter.post('/payment/create',userauth,async (req,res)=>{
    try{
         const order= await razorpayInstance.orders.create({
            "amount":MembershipType[req.body.membershipType]*100,
            "currency":"INR",
            "partial_payment":false,
            "notes":{
                "firstName":req.person.firstName,
                "lastName":req.person.lastName,
                "emailId":req.person.emailId,
                "memberShipType":req.body.membershipType,
            },
        });

        // console.log(order);
        const payment=new Payment({
            userId:req.person._id,
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            status:order.status,
            notes:order.notes,
        });
        const savedPayment=await payment.save();
        res.status(200).json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID});
    }
    catch(err){
        res.status(400).send("ERROR : "+err.message );
    }
});

paymentRouter.post('/payment/webhook',async (req,res)=>{
    try{
        const webhookSignature=req.headers('x-razorpay-signature');
           const isWebhookValid= validateWebhookSignature(JSON.stringify(req.body),
           webhookSignature,
           process.env.RAZORPAY_WEBHOOK_SECRET);

           if(!isWebhookValid){
            return res.status(400).send("Invalid webhook");
           }

           const paymentDetails=req.body.payload.payment.entity;
           const payment=await Payment.findOne({orderId:paymentDetails.order_id});
           payment.status=paymentDetails.status;
           await payment.save();
           const users=await userModel.findOne({_id:payment.userId});
           users.isPremiumUser=true;
            users.membershipType=payment.notes.membershipType;
              await users.save(); 

           if(req.body.event==="payment.captured"){
           }
           if(req.body.event==="payment.failed"){
           }
           res.status(200).json("webhook received");

    }catch(err){
        res.status(400).send("ERROR : "+err.message );
    }

});



module.exports=paymentRouter;