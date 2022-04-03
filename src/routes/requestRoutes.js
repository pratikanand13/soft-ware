const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const Request = require("../models/request");
const auth = require("../middlewares/auth");



router.post("/requests/addRequest",auth,async (req, res) => {
    try {
        const request = new Request(req.body)
        request.createdBy = req.user._id
        request.name = req.user.name
        await request.save()
        const user = await User.findById(req.user._id)
        user.userRequests = user.userRequests.concat({
            requestId:request._id
        })
        await user.save()
        const users = await User.find({});
        let fids=[]
        
        users.forEach(el => {
            if(el.fId!=req.user.fId) fids.push(el.fId)
        })
        res.status(200).send({
            request,
            fids
        })
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get("/requests/getRequest/:id",auth,async(req,res) => {
    try {
        const request = await Request.findById(req.params.id)
        res.status(200).send(request)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get("/requests/getAll",auth,async(req,res) => {
    try {
        const requests = await Request.find({})
        res.status(200).send(requests)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.patch("/requests/updateRequest",auth,async(req,res) => {
    try {
        const request = await Request.findById(req.body.id)
        if(request.createdBy.toString() == req.user._id.toString()) {
            if(req.body.completed) request.completed = req.body.completed
            if(req.body.collectedAmount) request.collectedAmount = req.body.collectedAmount
            await request.save()
            res.status(200).send(request)
            return
        }
        
        res.status(401).send("Cannot update other's request.")

    } catch (e) {
        res.status(500).send(e)
    }
})



router.patch("/requests/increment",async(req,res) => {
    try {
        const request = await Request.findById(req.body.id)
        // if(request.createdBy.toString() == req.user._id.toString()) {
            // if(req.body.completed) request.completed = req.body.completed
            if(req.body.collectedAmount) request.collectedAmount = req.body.collectedAmount
            await request.save()
            res.status(200).send(request)
            // return
        // }
        
        // res.status(401).send("Cannot update other's request.")

    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports=router