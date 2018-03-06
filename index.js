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
    
	io.emit('refresh list', people);
    //io.emit('populate messages', messageHistory);
    
    socket.on('name init', function(username) {
        var idName = people[socket.id];
        console.log("Socket " + idName + " assigned username " + username);
        people[socket.id] = username;
        io.emit('refresh list', people);
    });
    
    socket.on('name change', function(username) {
        
        var oldName = people[socket.id];
        people[socket.id] = username;
        io.emit('chat message', oldName + " changed name to " + username);
        console.log(oldName + " changed name to " + username);
        io.emit('refresh list', people);
    });
    
    socket.on('name load', function(username) {
        
        console.log(people[socket.id] + " loaded username " + username);
        
        people[socket.id] = username;
        
        io.emit('chat message', username + " joined the chat.");
        io.emit('refresh list', people);
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', people[socket.id] + ": " + msg);
        console.log(people[socket.id] + ": " + msg);
        var stringToSave = people[socket.id] + ": " + msg;
        messageHistory.push(stringToSave);
    });
    
    socket.on('disconnect', function() {
		console.log(people[socket.id] + ' disconnected.');
		io.emit('chat message', people[socket.id] + ' disconnected.');
		delete(people[socket.id]);
		io.emit('refresh list', people);
    });
});

function getNameFromID(id) {
    return people[id];
}

http.listen(3000, function() {
    console.log('listening on *:3000');
});