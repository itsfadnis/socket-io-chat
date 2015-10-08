socket.on('new participant', function(name) {
  $('#participants').append('<li id="P' + name + '">' + name + '</li>'); // append new participant
  $('#participantList').append('<li id="PM' + name + '">' + name + '</li>'); // append new participant to modal
  $('#participantCount').html(++count + ' participants'); // increment count
});

socket.on('chat message', function(data) {
  $('#messages').append($('<li>').html('<b>' + data.name + '</b>' + ': ' + data.message));
  $("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);
  $.titleAlert("New messages!", {
    requireBlur: true,
    stopOnFocus: true,
    duration: 0,
    interval: 700
  });
});

socket.on('typing', function(name) {
  if ($('#' + name).length == 0)
    $('#notificationBar').append('<span id="' + name + '">' + name + ' is typing.. </span>');
});

socket.on('stoppedTyping', function(name) {
  $('#' + name).remove();
});

socket.on('removeTyping', function(name) {
  $('#' + name).remove();
});

socket.on('disconnected', function(name) {
  $('#P' + name).remove(); // remove from participant list
  $('#PM' + name).remove(); // remove from participant modal
  $('#participantCount').html(--count + ' participants'); // decrement count
});
