import mongoose, { model } from "mongoose";

const UserSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        minlength:3,
        maxlenght:30
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength : 3,
        maxlenght :200,
    },
    password:{
        type:String,
        required:true,
        minlength : 3,
        maxlenght :1024,
    }
},{
    timestamps:true,
})


const UserModel = mongoose.model("Users",UserSchema)

export default UserModel

