var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('A user connected.');
    
    people[socket.id] = socket.id;
    
    socket.on('name change', function(nick) {
        people[socket.id] = nick;
        io.emit('chat message', socket.id + " changed name to " + nick);
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', people[socket.id] + ": " + msg);
    });
    
    socket.on('disconnect', function() {
       console.log('User disconnected.');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});