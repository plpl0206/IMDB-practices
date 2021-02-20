const express = require('express');
const cors = require('cors');
const passport = require('passport');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

const config = require('./config');
const { initSequelize } = require('./connections/mysql');

initSequelize(config.mysql);

require('./models');

const routes = require('./routes');

routes.setup(app);

const { setupRedis } = require('./connections/redis');

const server = app.listen(config.PORT, async () => {
  console.log(`Server listen on port:${config.PORT}`);
  try {
    await setupRedis(config.redis);
  } catch (err) {
    console.log(err.message);
  }
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
