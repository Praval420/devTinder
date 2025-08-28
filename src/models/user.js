const mongoose=require('mongoose');
const validator=require('validator');  // present in npm validator library documentaion
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address"+ value);
            }
        }
    },
    password:{
        type:String
    },
    age:{
        type:String
    },
    gender:{
        type:String
    }


    
},{
    timestamps:true
});

const userModel=mongoose.model("User",userSchema);

module.exports=userModel;

