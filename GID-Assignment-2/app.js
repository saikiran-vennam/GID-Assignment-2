const express = require("express");
const mongoose = require("mongoose");
const User = require("./schema/userSchema");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const postRoutes = require("./routes/posts");

mongoose.connect("mongodb://localhost/restapi",{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to DB')
})

var jwt = require('jsonwebtoken');
const secret = "RESTAPI";

const app = express();

app.use(express.json())

app.use("/posts", async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization.split("test ")[1];
        jwt.verify(token, secret, async function(err, decoded) {
            if (err) {
                return res.status(400).json({
                    status: "Failed",
                    message: "User Not Authenticated"
                })
            }
            const user = await User.findOne({_id: decoded.data});
            req.user = user._id;
            next();
          });

    }
    else {
       return  res.status(400).json({
            status: "Failed",
            message: "Invalid token"
        })
    }
});



app.use("/", userRoutes);
app.use("/",loginRoutes);
app.use("/",postRoutes);

app.get("*", (req, res) => {
    res.status(404).json({
        status: "Failed",
        message: "Please enter Correct URL"
    })
})


app.listen(3000, () => console.log("The server is running at 3000 port"));
