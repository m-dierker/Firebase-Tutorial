function scrollToBottomOfChatWindow() {
    $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
}

var discoIdx = 0;
var discoInterval;
// G-o-o-g-l-e!
var discoColors = ['blue', 'red', 'yellow', 'blue', 'green', 'red'];
function runDisco() {
    discoIdx = 0;
    _runDiscoStep();
    discoInterval = setInterval(function() {
        _runDiscoStep();
    }, 500);
}

function _runDiscoStep() {
    if (discoIdx == discoColors.length) {
        clearInterval(discoInterval);
        $('#chat-container').css('background-color', '');
    }

    $('#chat-container').css('background-color', discoColors[discoIdx]);
    discoIdx++;
}
