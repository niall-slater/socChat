var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log(client.id + ' connected.');
    
    client.on('set nickname', function(nick) {
        console.log(client.id + "changed name to " + nick);
        people[client.id] = nick;
        client.emit('update', "You have joined the server.");
        io.sockets.emit('update', nick + " has joined the server.");
        io.sockets.emit('update-people', people);
    });
    
    client.on('chat message', function(msg) {
        io.emit('chat message', people[client.id], msg);
    });
    
    client.on('disconnect', function() {
        io.sockets.emit("update", people[client.id] + " has left the server.");
        delete people[client.id];
        io.sockets.emit("update-people", people);
        console.log(client.id + ' disconnected.');
    });
});

http.listen(3001, function() {
    console.log('listening on *:3001');
});