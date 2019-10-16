const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 
const keys = require('../../config/keys')

exports.register =async (req, res)=>{
    const {email, password} = req.body
    let user = await User.findOne({email})
    if(user) res.json({ err:'Email already exists!' })
    else {
        bcrypt.genSalt( 10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                req.body.password = hash
                new User(req.body).save().then(()=>{
                    res.json({msg: 'registration Successful!'})
                })
            })
        })
        
    }
}

// Login form POST
exports.login =async (req, res) => {
    let user = req.user
    let token = jwt.sign({ user: _.pick(user, '_id') }, keys.jwt.secret, { expiresIn:'1h' }) 
    res.json({token})
}