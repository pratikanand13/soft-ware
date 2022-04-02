const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const Request = require("../models/request");
const auth = require("../middlewares/auth");



router.post("/users/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        const userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;

        res.status(200).send({
        userObject,
        token,
        });
    } catch (e) {
        res.status(400).send(e);
    }
});



router.post("/users/login", async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      const userObject = user.toObject();

      delete userObject.password;
      delete userObject.tokens;

      res.status(200).send({
      userObject,
      token,
      });
    } catch (e) {
      res.status(400).send(e);
    }
});



router.post("/users/logout", auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
  
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
});



router.post("/users/logoutAll", auth, async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
  
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
});



router.get("/users/profile", auth, async (req, res) => {
    try {
        const user = req.user
        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.tokens;

        res.status(200).send(userObject);
    } catch (e) {
        res.status(500).send(e);
    }
});



router.patch("/users/updateProfile", auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "age","gender","contactNo","fId"]
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        const user = req.user
        const userObject = user.toObject();

        delete userObject.password;
        delete userObject.tokens;

        res.status(200).send(userObject);
    } catch (e) {
        res.status(400).send(e)
    }
});



router.get("/users/getChats",auth,async (req, res)=>{
    try {
        const user = req.user
        const userObject = user.chats

        res.status(200).send(userObject);
    } catch (e) {
        res.status(500).send(e);
    }
})



router.get("/users/getRequests",auth,async (req, res)=>{
    try {
        const user = req.user
        let arr=[]
        for(const el of user.userRequests) {
            const request = await Request.findById(el.requestId)
            arr.push(request)
        }
        res.status(200).send(arr)
    } catch (e) {
        res.status(500).send(e);
    }
})



module.exports = router