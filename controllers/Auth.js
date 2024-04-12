const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require("dotenv").config()
//signup

exports.signup = async (req,res)=>{
    try{
        //grt data
        const {name,email,password} = req.body;

        //check user already exist or not
        const existUser = await User.findOne({email})

        if(existUser){
            return res.status(400).json({
                success:false,
                message: 'User already exist'
            })
        }

        //secure password
        let hashedpassword;

        try{
            hashedpassword = await bcrypt.hash(password,10);

        }catch(err){
            return res.status(500).json({
                success:false,
                message: 'Error in hashing password'
            })

        }

        //create entry

        const user = await User.create({
            name,
            email,
            password:hashedpassword,
            role:'Student'
        })

        return res.status(200).json({
            success:true,
            message:'user created successfully'
        })


 
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"user cannot registered"
        })
    }

}


//login
exports.login = async(req,res)=>{
    try{
        //fetch data
        const {email,password}= req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"fill all details"
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not existed"
            })
        }

        const payload ={
            email:user.email,
            id : user._id,
            role: user.role
            
        }

        if(await bcrypt.compare(password,user.password)){
            //create json web token
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user = user.toObject();
            user.token=token;
            user.password = undefined;
            
            const options ={
                expiresIn: new Date(Date.now() + 3*24*60*60*60*1000),
                httpOnly:true

            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"user logged in successfully"
            })


        }else{
            return res.status(403).json({
                success:false,
                message:"password incorrect"
            })

        }



    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"user cannot logged in"
        })


    }
}