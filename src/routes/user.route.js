const express = require('express')
const router = express.Router()

const user = require('../controllers/user.controller')
const validate = require('../validations/validations')

router.post('/register',validate.UserRegistration, user.register)

module.exports = router