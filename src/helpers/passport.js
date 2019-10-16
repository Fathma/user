const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = mongoose.model("User");

// user authentication by passport.js localstrategy. 
// user authentication by passport.js localstrategy. 
module.exports = function(passport) {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        
        // checks whether user already exists or not
        User.findOne({ email }).then(user => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }
  
          // matches the given password with the encrypted password 
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          })
        })
      })
    )
}


