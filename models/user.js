const mongoose = require('mongoose');
const {createHmac , randomBytes} = require('crypto');
const {createTokenForUser} = require('../services/authentication')

const userSchema  = mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['User' , 'Admin'],
        default : 'User'
    },
    profileImage : {
        type : String,
        default : "/image/default.jpeg"
    }
}, {timestamps : true});

userSchema.pre('save' , async function (){
    const u = this;
    if(!u.isModified('password')) return;

    const secretSalt = randomBytes(16).toString();

    const hashedPassW = createHmac('sha256' , secretSalt).update(u.password).digest("hex");
    this.salt = secretSalt;
    this.password = hashedPassW;

})

userSchema.statics.matchPasswordAndGenToken = async function(email , password){
    const user = await this.findOne({email});
    if(!user) throw new Error("user not found");

    const secretSalt = user.salt;
    const hashedPasswordDB = user.password

    const userProvidedHashed = createHmac('sha256' ,  secretSalt).update(password).digest("hex");
    if(hashedPasswordDB !== userProvidedHashed) throw new Error("Password invalid");

    return createTokenForUser(user)  // sending user info without password and salt
}

const User = mongoose.model('user' , userSchema);

module.exports = User; 