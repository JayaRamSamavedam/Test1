const Users = require("../schemas/userSchema");

const bcrypt =require("bcrypt");

const jwt =require ("jsonwebtoken");

const acc = process.env.ACESS_TOKEN;
const ref = process.env.REFRESH_TOKEN;


module.exports.userRegister = async(req,res)=>{
    console.log("I am invoked");
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error:"missing details"});
    }
    try{
        const preuser = await Users.findOne({email:email});
        if(preuser){
            return res.status(400).json({error:"this user has already registered in our organisation"});
        }
        else{
            const userregister = new Users({email,password});
            const stored = await userregister.save();
            res.status(200).json({message:"user registered successfully"});
        }
    }
    catch(error){
        res.status(500).json({error:error});
    }
};


module.exports.userLogin = async(req,res)=>{
    const {email,password} = req.body;
    if(!password || !email){
        return res.status(400).json({error:"invalid details"});

    }
    try{
        const pre = await Users.findOne({email:email});
        if(!pre){
            return res.status(400).json({error:"user not found"});
        }
        const isMatch = await bcrypt.compare(password,pre.password);

        if(isMatch){
            const tokens = await pre.generateAuthToken();
            const ref = tokens.ref;
            const acc  = tokens.acc;
            res.cookie('jwt',ref,{
                httpOnly:true,
                maxAge:24*60*60*1000
            });
            res.status(200).json({message:"user login successfully",acc:acc});
        }
    }
    catch(Error){
        res.status(500).json({error:Error});
    }
}