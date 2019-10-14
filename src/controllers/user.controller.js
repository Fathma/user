const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

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