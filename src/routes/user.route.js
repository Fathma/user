const express = require('express')
const passport = require('passport')
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const router = express.Router()

const user = require('../controllers/user.controller')
const validate = require('../helpers/validations')
const keys = require('../../config/keys')

var filename;

// create storage engine
const storage = new GridFsStorage(
  {
    url: keys.database.mongoURI,
    file: ( req, file ) => {
      return new Promise( ( resolve, reject ) => {
        crypto.randomBytes( 16, ( err, buf ) => {
          if ( err ) return reject( err )
          
          filename = buf.toString( 'hex' ) + path.extname( file.originalname )
          const fileInfo = {
            filename: filename,
            bucketName: 'fs'
          }
          resolve( fileInfo )
        })
      })
    }
  })

const upload = multer({ storage })


router.post('/register', validate.UserRegistration, user.register)
router.post('/login', validate.UserLogin, passport.authenticate('local', { session: false }), user.login)
router.post('/verify/:id', user.verify)
router.get('/profile', passport.authenticate('jwt', { session: false }), user.profile)
router.get('/list', passport.authenticate('jwt', { session: false }), user.list)
router.get('/google',  passport.authenticate('google', { scope:['profile', 'email'] }))
router.get('/google/redirect',  passport.authenticate('google'), user.authGoogleRedirect)
router.get('/update/:id', user.update)


router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook'), user.authFacebookRedirect)
router.get('/forgetPassword/emailOTP', user.emailOTP);
router.post('/forgetPassword/checkOTP', user.checkOTP);

module.exports = router