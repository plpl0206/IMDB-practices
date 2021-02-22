const moment = require('moment-timezone');

const TIMEZONE = 'Asia/Taipei';
const FORMAT = 'YYYY-MM-DD HH:mm:ss';

const dateHelper = {
  formatDate: (date = '', format = FORMAT, tz = TIMEZONE) => moment(date).tz(tz).format(format),

  getTimestamp: (datetime) => moment(datetime).unix() * 1000,
};

module.exports = dateHelper;
