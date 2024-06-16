const express = require("express");
const dotenv = require("dotenv");
const cors  =require("cors");
const cookieParser = require("cookie-parser");
// import cookieParser from "cookie-parser";
const mongoose = require("mongoose")
dotenv.config();
const PORT = process.env.PORT;
const app = express();
console.log("abcd1");
app.use(cors({
    origin:"*",
    methods:"POST",
    credentials:true,
}));

console.log("abcd2");
app.use(express.json());
app.use(cookieParser);
console.log("abcd3");
const url = process.env.DB_URL;
mongoose.connect(url)
.then(()=>{
    console.log("db connected");
})
.catch((error)=>{
    console.log(error)
})

// app.use(express.json());
console.log("abcd4");
const userrouter =require ("./routers/userRouter.js");
app.use(userrouter);
console.log("abcd5");
app.get("/abcd",()=>{
    console.log("abcd");
})
app.listen(PORT,()=>{
    console.log(`the connection has established ${PORT}`);
})

