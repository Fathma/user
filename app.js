const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const app = express()
const port = 3000 || process.env.PORT

const userRoute = require('./src/routes/user.route')

// Map global promise
mongoose.Promise = global.Promise;

// connecting database
mongoose.connect( keys.database.mongoURI, err => {
  if (!err) console.log("MongoDB connection Established, ");
  else console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
});

var con = mongoose.connection;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', userRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))