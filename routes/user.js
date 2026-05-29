const {Router} = require("express")
const router = Router();
const User = require('../models/user');

router.get("/signin" , (req,res)=>{
    return res.render("signin")
})

router.get("/signup" , (req,res)=>{
    return res.render("signup")
})

router.post("/signup" , async(req,res)=>{
    const {fullName , email , password} = req.body;
    const tmp = await User.create({
        fullName,email,password
    })

    return res.redirect("/")
})

router.post("/signin" , async (req,res)=>{
    const {email , password} = req.body;
    try{
    const token = await User.matchPasswordAndGenToken(email , password);

    return res.cookie("Token" , token).redirect("/");}
    catch(error)
    {
        return res.render("signin", {
            error : "Invalid Password or Email"
        })
    }
})

module.exports = router