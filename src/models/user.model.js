const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: { type: String },
    email: { type:String, required:true },
    password: { type: String, required: true },
    role: { type: String, required:true },
    // imageURL: { type: String, required:true },
    verified: { type: Boolean, default:false },
    date: { type: String, default:Date.now }
})

module.exports = mongoose.model('User', UserSchema, 'users')