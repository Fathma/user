const Joi = require('joi')


const UserReg = Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().min(5),
    role: Joi.string().trim().required(),
    password2: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
})


const UserLog = Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required()
})


exports.UserRegistration = (req, res, next)=>{
    Joi.validate(req.body, UserReg, (err, result)=>{
        if(err){
            res.json({err})
        }else{
            next()
        }
    })
}


exports.UserLogin = (req, res, next)=>{
    Joi.validate(req.body, UserLog, (err, result)=>{
        if(err){
            res.json({err})
        }else{
            next()
        }
    })
}
