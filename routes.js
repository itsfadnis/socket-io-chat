module.exports = function(app, participants) {
	app.get('/', function(req, response) {
		response.sendfile(__dirname + '/index.html');
	});
	app.get('/participants', function(req, res) {
		res.send(participants);
	});
}