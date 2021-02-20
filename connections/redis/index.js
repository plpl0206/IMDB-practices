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

let redis;
const setupRedis = async (config) => {
  redis = await connect(config);
};

module.exports = { redis, setupRedis };
