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
		$('#name').val('');
		$('#name').focus();
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
					$('#participants').prepend('<li id="P' + participant + '">' + participant + '</li>');
				});
				// set participant count
				count = participants.length;
				$('#participantCount').html(count + ' participant(s)');
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
		$('#messages').prepend($('<li>').text(message));
		socket.emit('chat message', { name: name, message: message } );		
	}
    $('#message').val('');s
    $('#message').focus();
}

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

$('#name').keyup(function(event) {
	if(event.keyCode == 13) {
		submitName();
	}
});

$("#message").keyup(function(event) {
	socket.emit('stoppedTyping', name);	// notify stopped typing 
    if(event.keyCode == 13){	// send message on enter
        sendMessage();
    }
});