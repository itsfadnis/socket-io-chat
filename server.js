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

http.listen(process.env.PORT || 8080, process.env.IP || '127.0.0.1', function() {
  console.log('Express app listening at ' + process.env.PORT);
});
