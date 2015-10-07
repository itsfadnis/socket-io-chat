module.exports = function(app, participants) {
  app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
  });
  app.get('/participants', function(req, res) {
    res.send(participants);
  });
}