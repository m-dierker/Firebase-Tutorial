var root = new Firebase('https://chat-room-tutorial.firebaseio.com/');
var chatRoom = root.child('chat');

var bodyTemplate = Handlebars.compile($('#body-template').html());
var username = 'Guest';
var messages = {};

$(document).ready(function () {
    renderTemplate();
    setupMessageListener();
    setupMessageLoader();
});

function setupMessageLoader() {
    chatRoom.on('value', function(snapshot) {
        messages = snapshot.val();
        renderTemplate();
    });
}


function renderTemplate() {
    var context = {
        username: username,
        messages: messages
    };

    $('#body-template-view').html(bodyTemplate(context));
    setupMessageListener();
}

function setupMessageListener() {
    $('#chat-box').focus().keypress(function (e) {
        if (e.which == 13) {
            var message = $(e.target).val();
            message = $.trim(message);

            if (message != '') {
                sendMessage(message);
            }

            $(e.target).val('');
        }
    });
}

function sendMessage(msg) {
    var msgObj = {
        avatar_url: 'http://placehold.it/48x48',
        message_author: username,
        message_text: msg
    };

    chatRoom.push(msgObj);
}
