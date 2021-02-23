const config = require('../config');
const { sequelizePool } = require('../connections/mysql');

const models = {
  Movie: require('./movie')(sequelizePool.mariadb),
  User: require('./user')(sequelizePool.mariadb),
  Comment: require('./comment')(sequelizePool.mariadb),
  AuditLog: require('./auditLog')(sequelizePool.mariadb),
};

sequelizePool.mariadb.sync({
  alter: config.configEnv !== 'production',
});

module.exports = models;
