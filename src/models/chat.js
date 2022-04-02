const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name1:{
            type:String,
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name2:{
            type:String,
        },
        chats: [
            {
                text:{
                    type:String,
                },
                byName:{
                    type:String,
                },
                byId:{
                    type:mongoose.Schema.Types.ObjectId,
                }
            }
        ]
    },
    {
        timestamps:true
    }
)

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;