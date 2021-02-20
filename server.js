const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const config = require('./config');
const { initSequelize } = require('./connections/mysql');

initSequelize(config.mysql);

require('./models');

const server = app.listen(config.PORT, () => {
  console.log(`Server listen on port:${config.PORT}`);
});

const handleServerShutdown = () => {
  console.log('Receive kill signal, shutting down gracefully');
  server.close(() => {
    process.exit();
  });
};

const handleUncaughtException = (error) => {
  console.log(error);
};

process.on('SIGINT', handleServerShutdown);
process.on('uncaughtException', handleUncaughtException);

module.exports = server;
