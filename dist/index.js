"use strict";

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _maxApi = _interopRequireDefault(require("max-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);
app.get('/', function (req, res) {
  res.send('Hello World');
});
app.get('/wstest', function (req, res) {
  res.sendFile(_path["default"].join(__dirname + '/static/wstest.html'));
});
io.on('connection', function (socket) {
  socket.on('message', function (m) {
    console.log(socket.id);
    console.log(m);

    _maxApi["default"].outlet({
      message: m.data.message,
      route: m.data.route,
      args: m.data.args
    });
  });

  _maxApi["default"].addHandler('tick', function (msg) {
    console.log('1', msg);
    socket.emit('message', {
      type: 'ITER_TEST',
      data: {
        c: msg
      },
      time: new Date()
    });
  });
}); // Use the 'outlet' function to send messages out of node.script's outlet

_maxApi["default"].addHandler('echo', function (msg) {
  _maxApi["default"].outlet(msg);
});

server.listen(3000);
console.log('Server Listening on Port 3000');
//# sourceMappingURL=index.js.map