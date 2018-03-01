var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    
    people[socket.id] = socket.id;
    console.log(people[socket.id] + ' connected.');
    
    for (var i = 0; i < people.length; i++) {
        io.emit('user join', people[i]);
    }
    
    socket.on('name change', function(nick) {
        people[socket.id] = nick;
        io.emit('chat message', socket.id + " changed name to " + nick);
        console.log(socket.id + " changed name to " + nick);
        io.emit('user join', nick);
    });
    
    socket.on('name load', function(nick) {
        people[socket.id] = nick;
        io.emit('chat message', nick + " joined the chat.");
        console.log(nick + " joined the chat.");
        io.emit('user join', nick);
    });
    
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', people[socket.id] + ": " + msg);
        console.log(people[socket.id] + ": " + msg);
    });
    
    socket.on('disconnect', function() {
       console.log(people[socket.id] + ' disconnected.');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});