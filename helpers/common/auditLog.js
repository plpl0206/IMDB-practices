const models = require('../../models');
const date = require('./date');

const auditLogHelper = {

  insertAuditLog: async (params) => {
    try {
      Object.assign(params, {
        operationTime: date.getTimestamp(new Date()),
      });
      await models.AuditLog.create(params);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = auditLogHelper;
