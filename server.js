var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  morgan = require('morgan'),
  participants = [];

app.use(morgan('dev')); 
app.use(express.static(__dirname + '/public')); 
require('./cors.js')(app); 
require('./routes.js')(app, participants); 
require('./socketEvents.js')(io, participants); 

http.listen(process.env.PORT, process.env.IP, function() {
  console.log('Express app listening at ' + process.env.PORT);
});
