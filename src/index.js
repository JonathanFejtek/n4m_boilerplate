import express from 'express';
import socket from 'socket.io';
import http from 'http';
import path from 'path';
import max from 'max-api';

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/wstest', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/wstest.html'));
});

io.on('connection', socket => {
    socket.on('message', m => {
        console.log(socket.id);
        console.log(m);
        max.outlet({ message: m.data.message, route: m.data.route, args: m.data.args });
    });

    max.addHandler('tick', msg => {
        console.log('1', msg);
        socket.emit('message', {
            type: 'ITER_TEST',
            data: {
                c: msg,
            },
            time: new Date(),
        });
    });
});
// Use the 'outlet' function to send messages out of node.script's outlet
max.addHandler('echo', msg => {
    max.outlet(msg);
});

server.listen(3000);

console.log('Server Listening on Port 3000');
