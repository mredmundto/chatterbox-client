// Stores all messages retrieved from the server
// The messages are in reverse chronological order,
// so message[0] is the most recent message retrieved
// from the PARSE server

// Retrieves the most recent 100 messages from the server
var app = {
  init: function() {},
  address: 'https://api.parse.com/1/classes/messages',
  _messageStorage: [],
  roomnames: ['superLobby']
};

app.send = function(message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('Message successfully sent!');
    },
    error: function(data) {
      console.log('ERROR: failed to send message', data);
    }
  });
};

app.fetch = function(address, callback) {
  $.ajax({
    url: address,
    type: 'GET',
    success: function(data) {
      app._messageStorage = data.results;
      _.each(app._messageStorage, function(message) {
        callback(message);
      });
    },
    error: function(data) {
      console.log('ERROR: failed to fetch messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.addMessage = function(message) {
  // Check if the message object has a roomname
  // Create the room if doesn't already exist, and place the 
  // message in both the main chat and also the room


  // Use the cleanMessage method to replace 
  // potentially malicious code with escape characters      
  message.username = app.cleanMessage(message.username);
  message.text = app.cleanMessage(message.text);
  message.roomname = app.cleanMessage(message.roomname);

  // Give a default room name
  if (message.roomname === undefined ||
      message.roomname === '' ||
      message.roomname === 'undefined') {
    message.roomname = 'superLobby';
  }

  // Check if the room already exists, if not, create it
  if (app.roomnames.indexOf(message.roomname) === -1) {
    app.addRoom(message.roomname);
    app.roomnames.push(message.roomname);
  }

  // Create the HTML for the new message
  var msgText = '<div class="room-superLobby room-' + message.roomname + '">' + message.username + ' : ' + message.text + '</div>';

  $('#chats').append(msgText);
};

app.addRoom = function(roomname) {
  var roomText = '<div id="' + roomname + '"></div>';
  $('#roomSelect').append(roomText);
  app.updateRoomMenu();
};

app.displayMessages = function() {
  app.clearMessages(); 
  app.fetch(app.address, app.addMessage);
};

app.cleanMessage = function(message) {
  // Uses escape characters to sanitze potentially malicious code
  // that's inserted in message content
  if (message !== undefined) {
    message = message.replace(/</g, '&lt');
    message = message.replace(/>/g, '&gt');
    message = message.replace(/&/g, '&amp');
    message = message.replace(/"/g, '&quot');
    message = message.replace(/'/g, '&#x27');
    message = message.replace(/\//g, '&#x2F');
  }
  return message;
};

// jQuery code
$('document').ready(function() {
  app.displayMessages();
  setInterval(app.displayMessages, 60000);

  $('#submit-custom-message').on('click', function() {
    console.log('user submission made');

    app.send({
      username: $('#username').val(),
      text: $('#usertext').val()
      // add roomname key/value
    });
  });
});

app.updateRoomMenu = function() {
  console.log(app.roomnames);
  // First clear the room selection options menu
  $('#roomAdd').children().remove();

  // Then populate it with names from our roomnames array
  _.each(app.roomnames, function(name) {
    var room = '<option value =' + name + '>' + name + '</option>';
    $('#roomAdd').append(room);
  }); 
};


// Step 1.  Before adding message to the DOM, check whether the message
// has a roomname value
    // If it does, check whether a room with that roomname already exists
    // If the room already exists, append the message to that room's DIV

    // If that room doesn't exist, add the room to the DOM, and then
    // place the message inside the newly created room

// Step 2.  Create a dropdown option that lets the user select which 
// room he would like to view    





















