const Joi = require('joi')

const User = Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().min(5).max(15),
    role: Joi.string().trim().required(),
})

exports.UserRegistration = (req, res, next)=>{
    
    Joi.validate(req.body, User, (err, result)=>{
        if(err){
            res.json({err})
        }else{
            next()
        }
    })
}
