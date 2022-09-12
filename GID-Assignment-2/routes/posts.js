const express = require("express");
const Post = require("../schema/postSchema");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router();
const secret = "RESTAPI";

router.get("/posts", async (req, res) => {
    const posts = await Post.find({user: req.user});
    res.json ({
        status: "Success",
        posts
    })

})

router.post("/posts", async (req, res) => {
    let updates = req.body;
    let fields = ["title", "image", "body"];
    for(let i of Object.keys(updates)) {
        if(!fields.includes(i) || Object.keys(updates).length != 3) {
            return res.status(400).json({
                status: "Failed to Add Post",
                message : "Please enter correct field names in the body. title, body and image are required."
            })
        }
    }
    try {
        const post = await Post.create({
            title : req.body.title,
            body : req.body.body,
            image: req.body.image,
            user : req.user
        });
        
        res.json ({
            status: "Success",
            post
        })
    }
    catch (e) {
        return res.status(400).json({
            status: "Failed to Add Post",
            message : e.message
        })
    }
})

router.put("/posts/:id", async (req, res) => {
    let updates = req.body;
    let fields = ["title", "image", "body"];
    for(let i of Object.keys(updates)) {
        if(!fields.includes(i)) {
            return res.status(400).json({
                status: "Failed to Update",
                message : "Please enter correct field names in the body"
            })
        }
    }

    try {
        let details = await Post.findOneAndUpdate({ 
            $and :[
                {
                    user:req.user
                },
                { _id:req.params.id}
            ]
        }, updates)

        if(!details) {
            return res.status(400).json({
                status: "Failed to Update",
                message: "There is NO record with id " + req.params.id
            })
        }
        let updated = await Post.findById(req.params.id);
        res.status(200).json ({
            status: "Successfully Updated",
            Updated: updated
        })
    }
    catch(e) {
        return res.status(400).json({
            status: "Failed to Update",
            message: e.message
        })
    }

})

router.delete("/posts/:id", async (req, res) => {
    try {
        let details = await Post.findOneAndDelete({ 
            $and :[
                {
                    user:req.user
                },
                { 
                    _id:req.params.id
                }
            ]
        })

        if(!details) {
            return res.status(400).json({
                status: "Failed to Delete",
                message: "There is NO record with id " + req.params.id
            })
        }
        res.status(200).json ({
            status: "Successfully Deleted",
            Deleted: details
        })
    }
    catch(e) {
        return res.status(400).json({
            status: "Failed to Delete",
            message: e.message
        })
    }

})

module.exports = router;