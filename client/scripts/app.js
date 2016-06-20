// YOUR CODE HERE:
var messages = [];
var prevMessages = [];

// Queries the PARSE server to obtain the 100 most recent messages
var getMessages = function() {
    $.get('https://api.parse.com/1/classes/messages', function(msg) { 
        prevMessages === messages;
        messages = msg.results;    // Results is the array of stored messages
    });
};

// Adds new messages as elements on the DOM
var displayMessages = function(messages) {
    // Filters the recently acquired messages to identify new messages
    // Uses the 'updatedAt' timestamp to identify new messages
    var newMessages;
    var mostRecentMessageTime;
    
    if (prevMessages.length > 0) {
        mostRecentMessageTime = Date.parse(prevMessages[0].updatedAt);

        newMessages = _.filter(messages, function(msg) {
            if (Date.parse(msg.updatedAt) > mostRecentMessageTime) {
                return msg;
            }
        });    
    } else {
        newMessages = messages;
    }
   
   // Append each new message to the DOM
   _.each(newMessages, function(msg) {
    $('#chats').append('<div><p>' + msg.text + '</p></div>');
    });
    
    console.log(newMessages);
};

// Main message retrieval/display loop
getMessages();

setInterval(function() {
    getMessages();
    displayMessages(messages);
}, 3000);

