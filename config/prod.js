module.exports = {
    database:{
        mongoURI: process.env.mongoURI
    },
    jwt:{
        secret: process.env.jwt_secret
    }
}