const express = require('express')
const passport = require('passport')
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const router = express.Router()

const user = require('../controllers/user.controller')
const validate = require('../helpers/validations')
const keys = require('../../config/keys')

var filename;

// create storage engine
const storage = new GridFsStorage(
  {
    url: keys.database.mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) return reject(err);
          
          filename = buf.toString('hex') + path.extname(file.originalname)
          const fileInfo = {
            filename: filename,
            bucketName: 'fs'
          };
          resolve(fileInfo)
        });
      });
    }
  });

const upload = multer({ storage })


router.post('/register', validate.UserRegistration, user.register)
router.post('/login', validate.UserLogin, passport.authenticate('local', { session: false }), user.login)
router.get('/verify/:token', user.verify)



module.exports = router