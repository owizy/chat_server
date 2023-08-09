import UserModel from "../Models/UserModel.js";
import ConversationModel from "../Models/conversation.js";
import MessageModel from "../Models/message.js"
const Message=async(req,res)=>{
  try {
    const { conversationId, senderId, message, receiverId= '' } = req.body;
    if (!senderId || !message) return res.status(400).send('Please fill all required fields')
    if (conversationId === 'new' && receiverId) {
        const newCoversation = new ConversationModel({ members: [senderId, receiverId] });
        await newCoversation.save();
        const newMessage = new MessageModel({ conversationId: newCoversation._id, senderId, message });
        await newMessage.save();
        return res.status(200).send('Message sent successfully');
    } else if (!conversationId && !receiverId) {
        return res.status(400).send('Please fill all required fields')
    }
    const newMessage = new MessageModel({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send('Message sent successfully');
} catch (error) {
    console.log(error, 'Error')
}
}

const MessageOne=async(req,res)=>{
    try{
        const conversationId = req.params.conversationId;  
      const checkMessages = async (conversationId) => {
        console.log(conversationId, 'conversationId')
        const messages = await MessageModel.find({ conversationId});
        const messageUserData = Promise.all(messages.map(async (message) => {
            const user = await UserModel.findById(message.senderId);
            return { user: { id: user._id, email: user.email, fullname: user.fullname }, message: message.message , timestamp:message.createdAt }
        }));
        res.status(200).json(await messageUserData);
    }
    
    if (conversationId === 'new') {
        const checkConversation = await ConversationModel.find({ members: {$all: [req.query.senderId, req.query.receiverId] } });
        if (checkConversation.length > 0) {
            checkMessages(checkConversation[0]._id);
        } else {
            return res.status(200).json([])
        }
    } else {
        checkMessages(conversationId);
    }
}catch(err){
   console.log("error : " + err.message)
   res.status(500).json(err.message)
}
}

export {Message ,MessageOne}