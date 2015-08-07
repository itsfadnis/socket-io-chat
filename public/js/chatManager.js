var socket = io();
var name = '';
var count = 0;

$(function() {
  $("#entryModal").modal('show');
  setMessageFeedHeight();
});

$(window).resize(function() {
  setMessageFeedHeight();
});

function setMessageFeedHeight() {
  var wHeight = $(window).height();
  $('.messageFeed').css({
    'height': (wHeight * 0.6) + 'px'
  });
}

function validateName(name) {
  var patt = /^\w+$/;
  return patt.test(name);
}

function submitName() {
  name = $('#name').val();
  if (!validateName(name)) {
    $('#emptyName').html('Name should be alphanumeric');
    $('#name').val('');
    $('#name').focus();
  } else {
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
        $.each(participants, function(index, participant) { // append participants
          $('#participants').append('<li id="P' + participant + '">' + participant + '</li>');
          $('#participantList').append('<li id="PM' + participant + '">' + participant + '</li>');
        });
        // set participant count
        count = participants.length;
        $('#participantCount').html(count + ' participant(s)');
      },
      error: function(xhr, status, error) {
        console.log('Ajax failure: ' + status);
      }
    });
    $('#entryModal').modal('hide');
    $('.container').removeClass('hidden');
  }
}

function sendMessage() {
  if ($('#' + name).length > 0)
    $('#' + name).remove();
  var message = $('#message').val();
  if (isEmpty(message)) {
    return false;
  } else {
    $('#messages').append($('<li>').text(message));
    socket.emit('chat message', {
      name: name,
      message: message
    });
  }
  $('#message').val('');
  $('#message').focus();
}

function isEmpty(text) {
  if (text.trim() == '')
    return true;
  return false;
}

function notifyTyping() {
  socket.emit('typing', name);
}

function notifyStoppedTyping(event) {
  socket.emit('stoppedTyping', name);
}

function removeTyping() { // on blur
  socket.emit('removeTyping', name);
}

$('#name').keyup(function(event) {
  if (event.keyCode == 13) {
    submitName();
  }
});

$("#message").keyup(function(event) {
  socket.emit('stoppedTyping', name); // notify stopped typing 
  if (event.keyCode == 13) { // send message on enter
    sendMessage();
  }
});
