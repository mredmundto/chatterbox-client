// Stores all messages retrieved from the server
// The messages are in reverse chronological order,
// so message[0] is the most recent message retrieved
// from the PARSE server

// Retrieves the most recent 100 messages from the server
var app = {
  init: function() {},
  address: 'https://api.parse.com/1/classes/messages',
  _messageStorage: []
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

app.fetch = function(callback) {
  $.ajax({
    url: app.address,
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
  // Use the cleanMessage method to replace 
  // potentially malicious code with escape characters      
  message.username = app.cleanMessage(message.username);
  message.text = app.cleanMessage(message.text);

  $('#chats').append('<div>' + message.username + ' : ' + message.text + '</div>');
};

app.addRoom = function(room) {
  // Check for malicious code in the room name
  message.roomname = app.cleanMessage(message.roomname);
  
  $('body').append('<div id="roomSelect"></div>');
  $('#roomSelect').append('<div id="' + room + '"></div>');
};

app.displayMessages = function() {
  app.clearMessages(); 
  app.fetch(app.addMessage);
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

// Start the chat program

app.displayMessages();


// var getMessages = function() {
//   $.get('https://api.parse.com/1/classes/messages', function(retrievedMessages) {
//     displayMessages(retrievedMessages.results);
//   });

// };


// // Appends new messages as elements to the DOM
// var displayMessages = function(retrievedMessages) {
//   _.each(retrievedMessages, function(msg) {
//     var cleanMSG = escapeMessages(msg.text);
//     var ele = '<div><p>' + cleanMSG + '</p></div>';
//     $('#chats').prepend(ele);
//   });
// };

// // Removes malicious script elements from a message
// var escapeMessages = function(msg) {
//   // Use regexp to include escape characters
//   msg = msg.replace(/</g, '&lt');
//   msg = msg.replace(/>/g, '&gt');
//   msg = msg.replace(/&/g, '&amp');
//   msg = msg.replace(/"/g, '&quot');
//   msg = msg.replace(/'/g, '&#x27');
//   msg = msg.replace(/\//g, '&#x2F');

//   return msg;
// };

// getMessages();