var socket = io();
var name = '';
var count = 0;

$(function() {
	$("#entryModal").modal('show');
});

function placeFooter() {    
    var windHeight = $(window).height();
    var footerHeight = $('#footer').height();
    var offset = parseInt(windHeight) - parseInt(footerHeight);
    $('#footer').css('top',offset);
}

function submitName() {
	name = $('#name').val();
	if(isEmpty(name)) {
		$('#emptyName').html('Name cannot be empty');
	}
	else {
		$(window).resize(function(e){
        	placeFooter();
    	});
    	placeFooter();
    	// hide it before it's positioned
    	$('#footer').css('display','inline');
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
	$('#participantCount').html(++count + ' participants');	// increment count
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
	$('#participantCount').html(--count + ' participants');	// decrement count
});

function isEmpty(text) {
	if(text.trim() == '')
		return true;
	return false;
}

function notifyTyping() {
	socket.emit('typing', name);
}

function notifyStoppedTyping() {
	socket.emit('stoppedTyping', name);
}

function removeTyping() {	// on blur
	socket.emit('removeTyping', name);
}