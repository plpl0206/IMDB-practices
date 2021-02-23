const currentConnections = {};
const socketIO = {};

const setupWebsocket = async (config) => {
  const app = require('express')();
  app.get('/', (req, res) => {
    res.send('ok');
  });

  const server = require('http').createServer(app);
  server.listen(config.port, () => {
    console.log(`Websocket server listen on port:${config.port}`);
  });

  socketIO.io = require('socket.io')(server, {});
  socketIO.io.on('connection', (socket) => {
    currentConnections[socket.id] = socket;
    socket.on('disconnect', () => {
      delete currentConnections[socket.id];
    });
  });
};

module.exports = { setupWebsocket, currentConnections, socketIO };
