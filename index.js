import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cors from "cors"
import UserRoute from "./Routes/UserRoutes.js";
import MessageRoute from "./Routes/MessageRoute.js";
import ConversationRoute from "./Routes/ConversationRoute.js";
import { Server } from "socket.io";
import UserModel from "./Models/UserModel.js";
import StatusRoute from "./Routes/statusRoute.js";

const io = new Server({cors:"https://chat-app-51na.onrender.com"})
dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
app.use("/api/user/",UserRoute)
app.use(MessageRoute)
app.use(ConversationRoute)
app.use(StatusRoute)
mongoose.connect(process.env.DbConnect).then(()=>{
    console.log("succssfully connected to Db")
}).catch((err)=>{
    console.log("connection to DB failed due to : "+ err)
})
let users = [];
io.on('connection', (socket)=>{
    console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });
   
socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await UserModel.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
            }else {
                io.to(sender.socketId).emit('getMessage', {
                    senderId,
                    message,
                    conversationId,
                    receiverId,
                    user: { id: user._id, fullName: user.fullName, email: user.email }
                });
            }
        });
socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    io.emit('getUsers', socket.userId);
});


const Port = process.env.Port || 8000
const Sockets = process.env.Sockets || 9000      
io.listen(Sockets)
app.listen(Port,()=>{
    console.log("Successful connected to : " + Port)
}) 
