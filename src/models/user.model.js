const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String },
    email: { type:String, required:true },
    password: { type: String },
    role: { type: String},
    // imageURL: { type: String, required:true },
    verified: { type: Boolean, default:false },
    date: { type: String, default:Date.now },
    googleId: { type:String },
    facebookId: { type:String }
})

module.exports = mongoose.model('User', UserSchema, 'users')

