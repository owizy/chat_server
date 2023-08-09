import express from "express";
import { FindOneUser, LoginUser, RegisterUser } from "../Contoller/UserControllers.js";

const UserRoute = express.Router()

UserRoute.post("/register",RegisterUser)
UserRoute.post('/login',LoginUser)
UserRoute.get("/find/:userId",FindOneUser)

export default UserRoute