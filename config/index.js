const ENV_DEVELOPMENT = 'development';
const NODE_ENV = process.env.NODE_ENV || ENV_DEVELOPMENT;

console.log(`NODE_ENV = ${NODE_ENV}`);

let config = {
  configEnv: NODE_ENV,
};

if (NODE_ENV === ENV_DEVELOPMENT) {
  config = require('./config.json');
} else {
  config = require(`./config_${NODE_ENV}.json`);
}

console.log(config);

module.exports = config;
