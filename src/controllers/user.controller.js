const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const _ = require('lodash') 

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
                    let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
                    let url = `http://localhost:3000/user/verify/${token}`
                    await Email.sendEmail( 'hiddenowl038@gmail.com', user.email, 'Password Change', `<a href='${url}'>verify</a>` );
                    res.json({ msg: 'registration Successful. Verify your email!' })
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
        const { user } = jwt.verify(req.params.token, keys.jwt.secret) 
        if ( user ) {
            await User.update({ _id: user }, { $set: { verified:true } })
            res.json({ msg: 'verified!' })
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
// console.log(req.user)
    let users = await User.find()
    res.json(users)
}


exports.authGoogleRedirect = async (req, res)=>{
    try{
        let user = req.user
        let user_exist= await User.findOne({ _id: user._id })
        if(user_exist){
            res.json({err: "Email already exists!"})
        }else{
            let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
            res.json({ msg:"Registration Successfull!", token })    
        }
    }catch(err){
        res.json(err)
    }
}


exports.authFacebookRedirect = async (req, res)=>{
    try{
        let user = req.user
        let user_exist= await User.findOne({ _id: user._id })
        if(user_exist){
            res.json({err: "Email already exists!"})
        }else{
            let token = jwt.sign({ user: _.pick( user, '_id' ) }, keys.jwt.secret, { expiresIn:'1h' }) 
            res.json({ msg:"Registration Successfull!", token })
        }
    }catch(err){
        res.json(err)
    }
}