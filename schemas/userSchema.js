const  mongoose = require("mongoose");
const  validator = require("validator");
// import { ExpressValidator } from "express-validator";
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");

const Acess_Token = process.env.ACESS_TOKEN;
const Refresh_Token = process.env.REFRESH_TOKEN;
const userSchema = mongoose.Schema({
    "email":{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email");
            }
        }
    },
    "password":{
        type:String,
        required:true,
        minlength:8,
    },
    AcessTokens:[
        {
            token:{
                type :String,
                requred:true,
            }
        }
    ],
    RefreshTokens:[
        {
            token:{
                type :String,
                requred:true,
            }
        }
    ]
    
});

userSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})

userSchema.methods.generateAuthToken = async function (){
    try{
        const acc = jwt.sign({_id:this._id.toSting()},Acess_Token,{expiresIn: '15m'});
        const ref = jwt.sign({_id:this._id.toSting()},Refresh_Token,{expiresIn: '24h'});
        this.AcessTokens = this.AcessTokens.concat({token:acc});
        this.RefreshTokens = this.RefreshTokens.concat({token:ref});
        await this.save();
        return {acc,ref};
    }
    catch(error){
        throw new Error(error);
    }
}

const Users = mongoose.model("Users",userSchema);
module.exports = Users;