const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String },
    email: { type:String, required:true },
    password: { type: String },
    role: { type: String, default:"user"},
    imageURL: { type: String},
    verified: { type: Boolean, default:false },
    date: { type: Date, default:Date.now },
    googleId: { type:String },
    facebookId: { type:String }
})

module.exports = mongoose.model('User', UserSchema, 'users')

