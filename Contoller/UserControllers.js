import UserModel from "../Models/UserModel.js";
import validator from "validator";
import brcypt from "bcrypt"
import jwt from "jsonwebtoken"

const CreateToken=(_id)=>{
   const jwtKey = process.env.Jwt_Secret_key;
   return jwt.sign({_id},jwtKey,{expiresIn:"3d"})
}


const RegisterUser = async(req,res)=>{
    try{
    const{fullname,email,password} =req.body
    let user = await UserModel.findOne({email})
    if(user) return res.status(400).json("User with this email already exist")
    if(!fullname || !email || !password) return res.status(400).json("All field are required")
    if(!validator.isEmail(email)) return res.status(400).json("Email is not a valid email")
    if(!validator.isStrongPassword(password)) return res.status(400).json("Please enter a strong password")
    user= new UserModel({fullname,email,password}) 
    const salt = await brcypt.genSalt(10)
    user.password = await brcypt.hash(user.password,salt)
    await user.save()
    const token = CreateToken(user._id)
    return res.status(200).json({_id:user._id,fullname,email,token})
}catch(err){
    console.log("error : " + err.message)
    res.status(500).json(err.message)
}
}
const LoginUser=async(req,res)=>{
    try{
       const{email,password} = req.body;
     const user = await UserModel.findOne({email})
     if(!user) return res.status(400).json("Invalid email or password")
     const ValidatePassword = await brcypt.compare(password, user.password)
    if(!ValidatePassword) return res.status(400).json("Invalid email or password") 
     const token = CreateToken(user._id)
    return res.status(200).json({ _id:user._id , email,fullname:user.fullname, token})
    }catch(err){
    console.log("error : " + err.message)
    res.status(500).json(err.message)
}
}
// const GetallUser =async(req,res)=>{
//     try{
//        const users = await UserModel.find()
//        res.sttatus(200).json(users)
//     }catch(err){
//     console.log("error : " + err.message)
//     res.status(500).json(err.message)
// }
// }
const FindOneUser =async(req,res)=>{
        try{
            const userId = req.params.userId
        const finduser = await UserModel.find({_id:{$ne:userId}});
     const usersData = Promise.all(finduser.map(async(user)=>{
        return{user:{email:user.email,fullname:user.fullname,receiverId:user._id}}
     }))

     res.status(200).json(await usersData)
    }catch(err){
    console.log("error : " + err.message)
    res.status(500).json(err.message)
}
}

export {RegisterUser, LoginUser,FindOneUser}