const authenticate=(req,res)=>{
    if(false){
        res.send("hello there middleware");
    }
    else{
        res.status(500).send("user not authenticated");
    }
}

module.exports={authenticate};