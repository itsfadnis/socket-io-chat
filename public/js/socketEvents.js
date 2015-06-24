socket.on('new participant', function(name) {
	$('#participants').prepend('<li id="P'+ name +'">' + name + '</li>');	// append new participant
	$('#participantCount').html(++count + ' participant(s)');	// increment count
});

socket.on('chat message', function (data) {
	$('#messages').prepend($('<li>').text(data.name + ': ' + data.message));
});

socket.on('typing', function(name) {
	if($('#'+name).length == 0)
		$('#notificationBar').append('<p id="' + name + '">' + name + ' is typing..');
});

socket.on('stoppedTyping', function(name) {
	$('#'+name).remove();
});

socket.on('removeTyping', function(name) {
	$('#'+name).remove();
});

socket.on('disconnected', function(name) {
	$('#P'+name).remove();	// remove from participant list
	$('#participantCount').html(--count + ' participant(s)');	// decrement count
});