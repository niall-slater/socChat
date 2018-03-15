/* SERVER SIDE CHAT SCRIPT */

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
    var connectionMsg = people[socket.id] + ' connected.'
    console.log(connectionMsg);
    
	io.emit('refresh list', people);
    socket.emit('populate messages', messageHistory);
    
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
        messageHistory.push(oldName + " changed name to " + username);
    });
    
    socket.on('name load', function(username) {
        
        console.log(people[socket.id] + " loaded username " + username);
        
        people[socket.id] = username;
        
        io.emit('chat message', username + " joined the chat.");
        io.emit('refresh list', people);
        messageHistory.push(username + " joined the chat.");
    });
    
    socket.on('chat message', function(msg) {
        io.emit('chat message', people[socket.id] + ": " + msg);
        console.log(people[socket.id] + ": " + msg);
        var stringToSave = people[socket.id] + ": " + msg;
        messageHistory.push(stringToSave);
    });
    
    socket.on('disconnect', function() {
        var msg = people[socket.id] + ' disconnected.';
		io.emit('chat message', msg);
		console.log(msg);
        messageHistory.push(msg);
		delete(people[socket.id]);
		io.emit('refresh list', people);
    });
    
    socket.on('base64 file', function (msg) {
        console.log('received base64 file ' + msg.fileName + ' from ' + msg.username);
        socket.username = msg.username;
        io.emit('base64 file', {
              username: socket.username,
              file: msg.file,
              fileName: msg.fileName
            }

        );
    });
});

function getNameFromID(id) {
    return people[id];
}

var port = 3000;

http.listen(port, function() {
    console.log('listening on *:' + port);
});