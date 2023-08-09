import  express  from "express";
import upload from "../upload.js";
import { getImages,uploadImage } from "../Contoller/StausController.js";

const StatusRoute = express.Router()


StatusRoute.post("/api/upload", upload.single("picture"), uploadImage);
StatusRoute.get("/api/images", getImages)


export default StatusRoute