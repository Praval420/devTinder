const express=require('express');
const http=require('http');
require('dotenv').config();
const app=express();
const {connection}=require('./src/config/database');
const cookieParser=require('cookie-parser')  
const cors=require("cors");
const initializeSocket=require('./src/utils/socket');

app.use(cors({
    origin:"http://localhost:5173",credentials:true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter=require('./src/routes/auth');  
const profileRouter=require('./src/routes/profile');
const connReq=require('./src/routes/request');
const userRoute=require('./src/routes/user');
const paymentRouter = require('./src/routes/payment');
const chatRouter=require('./src/routes/chat');

app.use('/',chatRouter);
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connReq);
app.use('/',userRoute);
app.use('/',paymentRouter);


const server=http.createServer(app);
initializeSocket(server);

connection().
then(()=>{
    console.log("Database connected");
    server.listen(7777,()=>{
        console.log("server is listening");
    })
}).catch((err)=>{
    console.log("database not connected")
})


