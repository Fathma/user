const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 
var speakeasy = require("speakeasy")
var secret = speakeasy.generateSecret({length: 20})

const User = require('../models/user.model')
const keys = require('../../config/keys')
const Email = require('../helpers/email')

exports.register = async (req, res)=>{
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if( user ) res.json({ err:'Email already exists!' })
    else {
        bcrypt.genSalt( 10, ( err, salt ) => {
            bcrypt.hash( password, salt, ( err, hash ) => {
                req.body.password = hash
                new User( req.body ).save().then(async(user)=>{
                    var token = speakeasy.totp({
                        secret: secret.base32,
                        encoding: 'base32'
                        // time: 60 // specified in seconds
                      })
                    await Email.sendEmail( 'hiddenowl038@gmail.com', 'siddiquefathma@gmail.com', 'Password Change', `<p> OTP:'${token}'</p>` )
                    res.json({ msg: 'An OTP is sent to the email' })
                    // let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
                    // let url = `http://localhost:3000/user/verify/${token}`
                    // await Email.sendEmail( 'hiddenowl038@gmail.com', user.email, 'Password Change', `<a href='${token}'>verify</a>` );
                    // res.json({ msg: 'registration Successful. Verify your email!' })
                })
            })
        })
    }
}


exports.login = async (req, res) => {
    try{
        let user = req.user
        let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
        res.json(token)
    }catch(err){
        res.json(err)
    }
}


exports.verify = async (req, res)=>{
    
    try {
        let verified = speakeasy.totp.verify({secret: secret.base32, token: req.body.token, encoding: 'base32', window: 7 })
       
        if ( verified ) {
            await User.update({ _id: req.params.id }, { $set: { verified:true } })
            res.json({ msg: 'verified!' })
        }else{
            res.json({ err: 'not verified!' })
        }
    } catch( err ) {
        res.json( err )
    }
}


exports.profile = async (req, res)=>{
    let user =  req.user
    if(!user){
        res.json({ err:'No user found' })
    }else{
        res.json( user )
    }
}


exports.list = async (req, res)=>{
    let users = await User.find()
    res.json(users)
}


exports.authGoogleRedirect = async (req, res)=>{
    try{
        let user = req.user
        let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
        res.json({ token })    
    }catch(err){
        res.json(err)
    }
}


exports.authFacebookRedirect = async (req, res)=>{
    try{
        let user = req.user
        let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
        res.json({ token })
    }catch(err){
        res.json(err)
    }
}

exports.emailOTP = async (req, res)=>{
 
    let user = await User.findOne({ email: req.body.email })
    if(!user) res.json({ err:"email doesn't exist!" })
    else {
        const token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' })
        const url = 'http://localhost:5000/user/forgetPassword/checkOTP/'+ token
        await Email.sendEmail( 'hiddenowl038@gmail.com', user.email, 'Password Change', `<p> OTP:'${url}'</p>` )
            res.json({ msg: 'An OTP is sent to the email' })
    }
}
exports.checkOTP = async (req, res)=>{
    try {
        
        const { user } = jwt.verify(req.params.otp, keys.jwt.secret) 
        if ( user ) {
            res.json({ msg: 'otp Matched' , user_id: user._id})
        }else{
            err={
                msg:"not matched"
            }
            res.json(err)
        }
    } catch( err ) {
        res.json( err )
    }
}

exports.update = async (req, res)=>{
    let user = await User.updateOne({ _id: req.params.id }, {$set: req.body})
    res.json({msg: "updated successfully!!"})
}