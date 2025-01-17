const User=require("../models/User");
const jwt=require("jsonwebtoken");
require('dotenv').config();

const secretKey=process.env.JWT_SECRET;
console.log(secretKey);

async function registerUser(req,res){
    let {firstName, lastName, username, password}=req.body;
    try{
        const duplicate= await User.find({username});
        if(duplicate && duplicate.length>0) return res.status(400).send({message:"User is already registered with this username"});
        let user=new User({firstName, lastName, username, password});
        const result=await user.save();
        console.log(user);
        res.status(200).send({message:"User registered successfully"});
 
    }
    catch(error){
        console.log(error);
        res.status(400).send(err);
    }
    
    
}

async function loginUser(req,res){
    try {
        const {username, password}=req.body;
        const user =await User.findOne({username});
        if(!user){
            return res.status(400).send({message:"Authentication Failed!"});
        }
        const isPasswordVaild=await user.comparePassword(password);
        if(!isPasswordVaild){
            return res.status(400).send({message:"Password Mismatch!"});
        }
        let token =await jwt.sign({userId:user._id},secretKey,{expiresIn:'1h'});

        let finalData={
            userId:user?._id,
            username:user?.username,
            firstName:user?.firstName,
            lastName:user?.lastName,
            token
        }
        res.send(finalData);
    } catch (error) {
        console.log(error);
        
    }
}


const AuthController={
    registerUser, loginUser
}

module.exports=AuthController;