import mongoose from "mongoose";

const StatusImagesSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    Images:{
        type:String
    }
})

const StatusImages= mongoose.model("ProfileImage",StatusImagesSchema)

export default StatusImages