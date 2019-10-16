const express = require('express')
const passport = require('passport')
const router = express.Router()

const user = require('../controllers/user.controller')
const validate = require('../helpers/validations')

router.post('/register', validate.UserRegistration, user.register)
router.post('/login', validate.UserLogin, passport.authenticate('local', { session: false }), user.login)


module.exports = router