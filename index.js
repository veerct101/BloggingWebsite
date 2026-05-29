require('dotenv').config({ override: true });
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user.js")
const userBlog = require("./routes/blog.js")
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/auth.js");
const Blog = require('./models/blog.js')

const PORT = process.env.PORT || 8002;
const app = express();

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("DB connected");
});

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie("Token"))
app.use(express.static(path.resolve('./public')))


app.use("/user" , userRoute);
app.use("/blog" , userBlog);

app.get('/' , async (req,res)=>{
    const allblog = await Blog.find({});
    res.render("home", {
        user : req.user,
        blogs : allblog
    });
})

app.get('/logout' , (req,res)=>{
    return res.clearCookie("Token").redirect("/");
})

app.listen(PORT , ()=>{console.log(`Server started at PORT : ${PORT}`)});
