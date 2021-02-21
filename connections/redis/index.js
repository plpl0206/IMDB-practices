const Redis = require('ioredis');

const connect = async (config) => new Promise((resolve, reject) => {
  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
  });

  client.on('connect', () => resolve(client));

  client.on('error', (error) => resolve(error));
});

const redis = {};
const setupRedis = async (config) => {
  const client = await connect(config);
  redis.master = client;
};

module.exports = { redis, setupRedis };
