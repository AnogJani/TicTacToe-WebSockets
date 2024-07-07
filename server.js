//imports
let express = require('express');
let socket = require('socket.io');

//running the server
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

//web sockets
let io = socket(server);
io.sockets.on('connection', (socket) => {
    console.log('New Connection! ' + socket.id);

    socket.on('click',(data) => {
        socket.broadcast.emit('click',data)
        console.log(data);
    });
});