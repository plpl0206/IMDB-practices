const { socketIO } = require('../../connections/websocket');

const EVENT = {
  NEW_MOVIE: 'movie/new',
  NEW_COMMENT: 'comment/new',
  UPDATE_MOVIE: 'movie/update',
  UPDATE_COMMENT: 'comment/update',
};

const websocketHelper = {
  ioBroadcast: async (event, data) => {
    socketIO.io.emit(event, JSON.stringify(data));
  },
};

module.exports = { websocketHelper, EVENT };
