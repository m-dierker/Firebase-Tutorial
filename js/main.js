var root = new Firebase('https://chat-room-tutorial.firebaseio.com/');
var chatRoom = root.child('chat');

var bodyTemplate = Handlebars.compile($('#body-template').html());
var username = 'Guest';
var userAvatarUrl = 'http://f.cl.ly/items/2M1K0Y1y2T353x0X0w05/minion_mario.jpg';
var messages = {};

$(document).ready(function () {
    renderTemplate();
    setupMessageLoader();
    attemptLogin();
});

function attemptLogin() {
    var user = root.getAuth();
    if (user) {
        console.log(user);
        loginWithAuthData(user);
    }
}

var _firstLoadCompleted = false;
function setupMessageLoader() {
    chatRoom.on('value', function(snapshot) {
        messages = snapshot.val();
        renderTemplate();

        scrollToBottomOfChatWindow();

        if (_firstLoadCompleted) {
            var ids = Object.keys(messages);

            if (ids.length == 0) {
                return;
            }

            var lastMessage = messages[ids[ids.length - 1]];
            if (lastMessage.message_text == '/disco') {
                runDisco();
            }
        } else {
            _firstLoadCompleted = true;
        }
    });
}

function renderTemplate() {
    var context = {
        username: username,
        messages: messages,
    };

    $('#body-template-view').html(bodyTemplate(context));
    setupTemplateListeners();
}

function setupTemplateListeners() {
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

    $('#fb-login').click(function() {
        root.authWithOAuthPopup('facebook', function(err, authData) {
            loginWithAuthData(authData);
        });
    });
}

function loginWithAuthData(authData) {
    username = authData.facebook.displayName;
    userAvatarUrl = authData.facebook.cachedUserProfile.picture.data.url;
    renderTemplate();
}

function sendMessage(msg) {
    var msgObj = {
        avatar_url: userAvatarUrl,
        message_author: username,
        message_text: msg,
        timestamp: Firebase.ServerValue.TIMESTAMP
    };

    chatRoom.push(msgObj);
}

Handlebars.registerHelper('getDateString', getDateString);
function getDateString(timestamp) {
    console.log('timestamp', timestamp);
    return moment(new Date(timestamp)).fromNow();
}
