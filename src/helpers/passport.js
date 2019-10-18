const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy;
const googleStrategy = require('passport-google-oauth2')

const keys = require('../../config/keys')

// Load user model
const User = mongoose.model("User")

// user authentication by passport.js localstrategy. 
module.exports = (passport)=> {
    passport.use( new LocalStrategy({ usernameField: "email" }, async ( email, password, done ) => {
        
        // checks whether user already exists or not
        let user = User.findOne({ email })
        
        if ( !user ) {
            return done( null, false, { message: "No user found" } )
        }

        // matches the given password with the encrypted password 
        bcrypt.compare( password, user.password, ( err, isMatch ) => {
            if ( err ) throw err
            if ( isMatch ) {
                return done( null, user )
            } else {
                return done( null, false, { message: "Password incorrect" } )
            }
        })
    }))



    passport.use(new googleStrategy({
        callbackURL: '/user/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    },( accessToken, refreshToken, profile, done )=>{
    User.findOne({ googleId: profile.id }, ( err, user )=>{
        if(!user){
        var user = { 
            name: profile.displayName,
            googleId: profile.id,
            email: profile.email,
            role: 'user',
            verified: true
        }
        new User(user).save().then( user => done( null, user ))
        }else{
            done( null, user )
        }
        })
    }))


    passport.use(new facebookStrategy({
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "/user/facebook/callback",
        profileFields: [ 'displayName', 'emails' ] 
    },
    (accessToken, refreshToken, profile, done)=> {
        User.findOne({ facebookId: profile.id }, (err, user)=>{
        if(!user){
            var user = { 
            username: profile.displayName,
            facebookId: profile.id,
            email: profile._json.email, 
            role: "user",
            verified: true
        }
        new User(user).save().then( user => done(null, user))
        }else{
            done(null, user)
        }
        });
    }
    ));

}

// saves it into cookies
passport.serializeUser((user, done)=>{
    done(null, user.id)
  })
  
  
// deserializes user id to get user info when user makes a page request
passport.deserializeUser((id, done)=>{
User.findById(id).then(user=>{
    done(null, user)
})
})
  