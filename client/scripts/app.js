// Stores all messages retrieved from the server
// The messages are in reverse chronological order,
// so message[0] is the most recent message retrieved
// from the PARSE server
var messages = [];

// Retrieves the most recent 100 messages from the server
var getMessages = function() {
  $.get('https://api.parse.com/1/classes/messages', function(msg) {
    messages = msg.results;
    displayMessages(messages);
  });

};

// Appends new messages as elements to the DOM
var displayMessages = function(messages) {
  _.each(messages, function(msg) {
    var ele = '<div><p>' + msg.text + '</div></p>';
    $('#chats').prepend(ele);
  });
};

getMessages();