const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy
const googleStrategy = require('passport-google-oauth2')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt

const keys = require('../../config/keys')
const User = mongoose.model("User")

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt.secret
}


module.exports = (passport)=> {
    passport.use( new LocalStrategy({ usernameField: "email" }, async ( email, password, done ) => {
        let user =await User.findOne({ email })
        if (!user) {
            return done( null, false, { message: "No user found" } )
        }
       
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
        new User( user ).save().then( user => done( null, user ))
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
    ( accessToken, refreshToken, profile, done )=> {
        User.findOne({ facebookId: profile.id }, ( err, user )=>{
        if(!user){
            var user = { 
                username: profile.displayName,
                facebookId: profile.id,
                email: profile._json.email, 
                role: "user",
                verified: true
            }
            new User( user ).save().then( user => done( null, user ))
        }else{
            done( null, user )
        }
        })
    }))


    passport.use( new JwtStrategy( opts, ( payload, done ) => {
        User.findOne({ _id: payload.user._id }, ( err, user)=> {
            if (err) {
                return done( err, false )
            }
            if (user) {
                return done( null, user )
            } else {
                return done( null, false )
            }
        })
    }))
}


// saves it into cookies
passport.serializeUser(( user, done )=>{
    done( null, user.id )
})
  
  
// deserializes user id to get user info when user makes a page request
passport.deserializeUser((id, done)=>{
    User.findById( id ).then( user=>{
        done( null, user )
    })
})
  