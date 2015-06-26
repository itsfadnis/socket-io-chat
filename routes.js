module.exports = function(app, participants) {
	app.get('/', function(req, res) {	// index
		res.sendfile(__dirname + '/index.html');
	});
	app.get('/participants', function(req, res) {	// returns participants on log in
		res.send(participants);
	});
}