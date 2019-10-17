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
    }
}