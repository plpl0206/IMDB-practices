const { Sequelize } = require('sequelize');

const defaultOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  charset: 'utf8mb4',
  connectTimeout: 30000,
};

const sequelizePool = {};
const initSequelize = (config) => {
  const conn = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      defaultOptions: Object.assign(defaultOptions, {
        requestTimeout: 3000,
        useUTC: false,
        skipSetTimezone: true,
      }),
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    },
  );
  sequelizePool[config.dialect] = conn;
};

module.exports = { initSequelize, sequelizePool };
