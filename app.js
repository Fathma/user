const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require("passport")
const Grid = require('gridfs-stream')

const app = express()
const port = 5000 || process.env.PORT

const keys = require('./config/keys')
const userRoute = require('./src/routes/user.route')

// Map global promise
mongoose.Promise = global.Promise;

// connecting database
mongoose.connect( keys.database.mongoURI, err => {
  if (!err) console.log("MongoDB connection Established, ");
  else console.log("Error in DB connection :" + JSON.stringify(err, undefined, 2));
});

con = mongoose.connection;

let gfs;

con.once('open', function () {
 gfs = Grid(con.db, mongoose.mongo);
 gfs.collection('fs');
})

// Passport config
require("./src/helpers/passport")(passport);


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Passport middleware
app.use(passport.initialize());

// route for fetching image
app.get("/image/:filename", (req, res) => {
 gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
   if(file != null ){
     const readstream = gfs.createReadStream(file.filename)
     readstream.pipe(res)
   }
 })
});

app.use('/user', userRoute)

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || 5000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    
  });
})
