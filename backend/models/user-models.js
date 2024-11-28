const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullName:{type: String},
    email:{type:String},
    password:{type:String},
    createdOn: {type:Date, default: new Date().getTime()},        
})

const User = new mongoose.model("User", userSchema);

module.exports= User;
