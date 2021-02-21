const models = require('../../models');

const userServices = {
  getUserInfo: async (req, res, next) => {
    const { userId } = req.user;
    const user = await models.User.getNoPwdUserById(userId);
    res.response = {
      data: user,
    };
    next();
  },

  updateUserInfo: async (req, res, next) => {
    const { userId } = req.user;
    try {
      await models.User.update(req.updateData, {
        where: { userId },
      });

      const user = await models.User.getNoPwdUserById(userId);
      res.response = {
        data: user,
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'UPDATE USER FAIL',
      };
    }

    return next();
  },

  removeUserInfo: async (req, res, next) => {
    const { userId } = req.user;
    try {
      const user = await models.User.destroy({ where: { userId } });
      res.response = {
        msg: 'DELETE USER SUCCESS',
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'DELETE USER FAIL',
      };
    }

    return next();
  },

};

module.exports = userServices;
