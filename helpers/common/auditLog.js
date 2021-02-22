const models = require('../../models');

const auditLogHelper = {

  insertAuditLog: async (params) => {
    try {
      await models.AuditLog.create(params);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = auditLogHelper;
