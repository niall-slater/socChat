var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};
var messageHistory = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    
    people[socket.id] = socket.id;
    console.log(people[socket.id] + ' connected.');
    
	io.emit('populate list', people);
    io.emit('populate messages', messageHistory);
	
    for (var i = 0; i < people.length; i++) {
        io.emit('user join', people[i]);
    }
    
    socket.on('name change', function(nick) {
        var oldName = people[socket.id];
        people[socket.id] = nick;
        io.emit('chat message', oldName + " changed name to " + nick);
        console.log(oldName + " changed name to " + nick);
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
        var stringToSave = people[socket.id] + ": " + msg;
        messageHistory.push(stringToSave);
    });
    
    socket.on('disconnect', function() {
		console.log(people[socket.id] + ' disconnected.');
		socket.broadcast.emit('user leave', people[socket.id]);
		socket.broadcast.emit('chat message', people[socket.id] + ' disconnected.');
		delete(people[socket.id]);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});