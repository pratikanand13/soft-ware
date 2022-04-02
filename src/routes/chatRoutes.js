const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const Request = require("../models/request");
const auth = require("../middlewares/auth");



router.post("/chats/sendChat",auth,async (req, res)=>{
    try {
        const user = req.user
        let arr=[]
        arr = user.chats.filter(ch => ch.toId == req.body.id)
        const person = await User.findById(req.body.id)
        if(person._id.toString()==req.user._id.toString()) {
            res.status(404).send("Cannot send messages to yourself")
            return
        }
        if(arr.length==0) {
            const chat = new Chat({
                user1:user._id,
                name1:user.name,
                user2:person._id,
                name2:person.name,
                chats:[
                    {
                        text:req.body.message,
                        byName:user.name,
                        byId:user._id
                    }
                ]
            })
            await chat.save()

            user.chats = user.chats.concat({
                chatId:chat._id,
                name:person.name,
                toId:person._id
            })
            await user.save();

            person.chats = person.chats.concat({
                chatId:chat._id,
                name:user.name,
                toId:user._id
            })
            await person.save()
            const fId = person.fId
            res.status(200).send({
                chat,
                fId
            })
            return
        }

        const chat = await Chat.findById(arr[0].chatId)
        chat.chats = chat.chats.concat({
            text:req.body.message,
            byName:user.name,
            byId:user._id
        })

        await chat.save()
        const fId = person.fId
        res.status(200).send({
            chat,
            fId
        })
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get("/chats/:id",auth,async(req, res)=>{
    try {
        const chat = await Chat.findById(req.params.id)
        if(chat.user1.toString()==req.user._id.toString() || chat.user2.toString()==req.user._id.toString()) {
            res.status(200).send(chat)
            return
        }
        
        res.status(401).send("Invalid: You are not a part of this chat stream")
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post("/chats/initialize",auth,async(req, res)=>{
    try {
        const user = req.user
        let arr=[]
        arr = user.chats.filter(ch => ch.toId == req.body.id)
        const person = await User.findById(req.body.id)
        if(person._id.toString()==req.user._id.toString()) {
            res.status(404).send("Cannot send messages to yourself")
            return
        }
        if(arr.length==0) {
            const chat = new Chat({
                user1:user._id,
                name1:user.name,
                user2:person._id,
                name2:person.name,
                chats:[]
            })
            await chat.save()

            user.chats = user.chats.concat({
                chatId:chat._id,
                name:person.name,
                toId:person._id
            })
            await user.save();

            person.chats = person.chats.concat({
                chatId:chat._id,
                name:user.name,
                toId:user._id
            })
            await person.save()
            const fId = person.fId
            res.status(200).send({
                chat,
                fId
            })
            return
        }
        const fId = person.fId
        const chat = await Chat.findById(arr[0].chatId)
        res.status(200).send({
            chat,
            fId
        })
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports =router