module.exports = function(io, participants) {
  io.on('connection', function(socket) {
    var client = {};
    socket.on('new participant', function(name) {
      // push to participant list
      participants.push(name);
      //update new client, this is used to track the client while disconnecting
      client.name = name;
      client.socket = socket;
      console.log(new Date() + ' ' + client.name + ' connected');
      // broadcast new user notification
      socket.broadcast.emit('new participant', name);
    });
    socket.on('chat message', function(data) {
      socket.broadcast.emit('chat message', data);
    });
    socket.on('typing', function(name) {
      socket.broadcast.emit('typing', name);
    });
    socket.on('stoppedTyping', function(name) {
      socket.broadcast.emit('stoppedTyping', name);
    });
    socket.on('removeTyping', function(name) {
      socket.broadcast.emit('removeTyping', name);
    });
    socket.on('disconnect', function() {
      if (client.name == undefined) {
        // do nothing, client disconnected before joining chat
      } else {
        console.log(new Date() + ' ' + client.name + ' disconnected');
        // remove from participants list
        participants.splice(participants.indexOf(client.name), 1);
        // broadcast to other participants
        socket.broadcast.emit('disconnected', client.name);
      }
    });
  });
}