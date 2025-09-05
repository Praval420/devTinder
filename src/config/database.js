const mongoose=require('mongoose');


async function connection(){
    try{
       await mongoose.connect(process.env.DB_CONNECTION_SECRET);
       

    }
    catch(err){
        console.log("Error in database connection");
    }

}

module.exports={connection};