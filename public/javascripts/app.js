$(function() {

//=============== POKE FOR TESTING CONNECTION ====================//
    $('#poke').click(function () {
        socket.emit('message', 'Hi server, how are you?');
    })

// Key 1 
    $("#key1").on("mousedown", function() {
        //socket.emit('message', 'Pressed Key 1');
    })

    $("#key1").on("mouseup", function() {
    })

// Key 2
    $("#key2").on("mousedown", function() {
        //socket.emit('message', 'Pressed Key 2');
    })

    $("#key2").on("mouseup", function() {
    })
});