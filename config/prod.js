module.exports = {
    database:{
        mongoURI: process.env.mongoURI
    },
    jwt:{
        secret: process.env.jwt_secret
    },
    email:{
        MAILGUN_USER: process.env.MAILGUN_USER,
        MAILGUN_PASS: process.env.MAILGUN_PASS 
    },
    google:{
        clientID: process.env.google_clientID,
        clientSecret: process.env.google_clientSecret
    },
    facebook:{
        clientID: process.env.facebook_clientID,
        clientSecret: process.env.facebook_clientSecret,
    }
}