var socket = io();
var name = '';
var count = 0;

$(function() {
	$("#entryModal").modal('show');
});

function submitName() {
	name = $('#name').val();
	if(isEmpty(name)) {
		$('#emptyName').html('Name cannot be empty');
	}
	else {
		// emit new participant
		socket.emit('new participant', name);
		// get participant list from server and append to side bar
		$.ajax({
			type: 'GET',
			url: 'http://localhost:5000/participants',
			dataType: 'json',
			success: function(participants) {
				console.log('Participants: ');
				console.log(participants);
				$.each(participants, function(index, participant) {		// append participants
					$('#participants').append('<li id="' + name + '">' + participant + '</li>');
				});
				// set participant count
				count = participants.length;
				$('#participantCount').html(count + ' participants');
			},
			error: function(xhr, status, error) {
				console.log('Ajax failure: ' +  status);
			}
		});
		$('#entryModal').modal('hide');
		$('.container').removeClass('hidden');
	}
}

function sendMessage() {
	if($('#'+name).length > 0) 
		$('#'+name).remove();
	var message = $('#message').val();
	if(isEmpty(message)) {
		return false;
	}
	else {
		$('#messages').append($('<li>').text(message));
		socket.emit('chat message', { name: name, message: message } );		
	}
    $('#message').val('');
    $('#message').focus();
}

socket.on('new participant', function(name) {
	$('#participants').append('<li id="'+ name +'">' + name + '</li>');	// append new participant
	$('#participantCount').html(++count + ' participant(s)');	// increment count
});

socket.on('chat message', function (data) {
	$('#messages').append($('<li>').text(data.name + ': ' + data.message));
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
	$('#'+name).remove();	// remove from participant list
	$('#participantCount').html(--count + ' participant(s)');	// decrement count
});

function isEmpty(text) {
	if(text.trim() == '')
		return true;
	return false;
}

function notifyTyping() {
	socket.emit('typing', name);
}

function notifyStoppedTyping(event) {
	socket.emit('stoppedTyping', name);
}

function removeTyping() {	// on blur
	socket.emit('removeTyping', name);
}

$("#message").keyup(function(event) {
	socket.emit('stoppedTyping', name);	// notify stopped typing 
    if(event.keyCode == 13){	// send message on enter
        sendMessage();
    }
});