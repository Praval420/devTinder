const mongoose=require('mongoose');


async function connection(){
    try{
       await mongoose.connect('mongodb+srv://sourav12345singhpraval:L9nyBckCJpOZ8nKY@cluster0.fxp0rp4.mongodb.net/devTinder');
       

    }
    catch(err){
        console.log("Error in database connection");
    }

}

module.exports={connection};