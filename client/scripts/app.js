// Stores all messages retrieved from the server
// The messages are in reverse chronological order,
// so message[0] is the most recent message retrieved
// from the PARSE server

// Retrieves the most recent 100 messages from the server
var app = {
  init: function() {},
  address: 'https://api.parse.com/1/classes/messages',
  _messageStorage: [],
  roomnames: ['superLobby'],
  _friends: []
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
    data: { roomname: 'chatroom'},
    success: function(data) {
      app._messageStorage = data.results;
      _.each(app._messageStorage, function(message) {
        callback(message);
      });
      app.checkForFriends();
    },
    error: function(data) {
      console.log('ERROR: failed to fetch messages', data);
    }
  });
};

/* Example of a get request that asks the server to return only
   data that meets certain qualifications

   $.ajax({
    url: app.address,
    type: 'GET',
    data: "where=" + JSON.stringify({"roomname": "4chan"}),
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log('ERROR: failed to fetch messages', data);
    }
  });
*/

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
  message.roomname = app.convertRoomName(message.roomname);

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

  // Create timestamp for the message
  var timestamp = new Date(message.updatedAt);
  timestamp = 'Created at: ' + timestamp.getFullYear() + '-' + timestamp.getMonth() +
              '-' + timestamp.getDate() + ' at ' + timestamp.toLocaleTimeString().replace("/.*(\d{2}:\d{2}:\d{2}).*/", "$1");

  // Create the HTML for the new message
  var msgText = '<div class="chat room-superLobby room-' + message.roomname + '">' + 
                '<p class="username">' + message.username + '</p>' + 
                '<p class="usertext">' + message.text + '</p>' +
                '<p class="usertimestamp">' + timestamp + '</div>';

  $('#chats').append(msgText);
};

app.addRoom = function(roomname) {
  var roomText = '<div id="' + roomname + '"></div>';
  $('#roomSelect').append(roomText);
  app.updateRoomMenu();
};

app.convertRoomName = function(roomname) {
  if (roomname !== undefined && roomname !== null) {
    roomname = roomname.replace(/</g, '');
    roomname = roomname.replace(/>/g, '');
    roomname = roomname.replace(/&/g, '');
    roomname = roomname.replace(/"/g, '');
    roomname = roomname.replace(/'/g, '');
    roomname = roomname.replace(/\//g, '');
    roomname = roomname.split(' ').join('');
  }

  return roomname;
};

app.updateRoomMenu = function() {
  // First clear the room selection options menu
  $('#roomSelect').children().remove();

  // Then populate it with names from our roomnames array
  _.each(app.roomnames, function(name) {
    var room = '<option value =' + name + '>' + name + '</option>';
    $('#roomSelect').append(room);
  }); 
};

app.displayMessages = function() {
  app.clearMessages(); 
  app.fetch(app.address, app.addMessage);
};

app.cleanMessage = function(message) {
  // Uses escape characters to sanitze potentially malicious code
  // that's inserted in message content
  if (message !== undefined && message !== null) {
    message = message.replace(/</g, '&lt');
    message = message.replace(/>/g, '&gt');
    message = message.replace(/&/g, '&amp');
    message = message.replace(/"/g, '&quot');
    message = message.replace(/'/g, '&#x27');
    message = message.replace(/\//g, '&#x2F');
  }
  return message;
};

app.checkForFriends = function() {
  var messages = $('#chats').children();

  _.each(messages, function(msg) {
    var childNodes = $(msg).children();
    var name;

    for (var i = 0; i < childNodes.length; i++) {
      if ($(childNodes[i]).hasClass('username')) {
        name = childNodes[i];
      }
    }

    if (app._friends.indexOf($(name).text()) !== -1) {
      $(msg).addClass('friend');
    }
  });
};

// jQuery code
$('document').ready(function() {
  // Display the initial message and periodically update the field
  app.displayMessages();
  $('#userroomname').val('superLobby');
  setInterval(app.displayMessages, 10000);

  // Activates the custom message option
  $('#submit-custom-message').on('click', function() {

    // Send the message to the server
    app.send({
      username: $('#username').val(),
      text: $('#usertext').val(),
      roomname: $('#userroomname').val()
    });

    // Clear the input field for message option
    $('#usertext').val('');
  });

  // Toggle which room the user wants to view
  $('#roomSelect').change(function() {
    var roomSelected = $(this).val(); 

    _.each(app.roomnames, function(room) {
      if (room !== roomSelected) {
        $('.room-' + room).hide();
      }
    });
    $('.room-' + roomSelected).show();

    $('#userroomname').val(roomSelected);
  });

  // Allow users to select friends
  $(document).on('click', '.username', function() {
    var user = $(this).text();
    app._friends.push(user);
    app.checkForFriends();
  });

  // WHY DOESN'T THIS CODE WORK?!?!?!
  // $('.username').click(function() {
  //   var user = $(this).text();
  //   console.log('clicked on ' + user);
  // });

});

