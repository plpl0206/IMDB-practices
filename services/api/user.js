const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const models = require('../../models');
const responseHelper = require('../../helpers/common/response');

const createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createUserSchemaValidator = validator.body(createUserSchema);

const userServices = {

  createUser: async (req, res, next) => {
    const { username, email, password } = req.body;

    const emailExisted = await models.User.emailExisted(email);
    if (emailExisted) {
      res.status(responseHelper.RESPONSE_CODE.BAD_REQUEST).json({
        msg: responseHelper.RESPONSE_MSG.SIGN_UP_EMAIL_EXISTED,
      });
      return;
    }
    const user = await models.User.createUserByEmail(email, username, password);

    if (user.isError) {
      res.status(responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({
        msg: user.original ? user.original.code : responseHelper.RESPONSE_MSG.CREATE_USER_FAILURE,
      });
      return;
    }
    req.logIn(user, { session: false });
    next();
  },

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
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.UPDATE_USER_FAILURE,
      };
    }

    return next();
  },

  removeUserInfo: async (req, res, next) => {
    const { userId } = req.user;
    try {
      const user = await models.User.destroy({ where: { userId } });
      res.response = {
        msg: responseHelper.RESPONSE_MSG.DELETE_USER_SUCCESS,
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.DELETE_USER_FAILURE,
      };
    }

    return next();
  },

};

module.exports = {
  createUserSchemaValidator,
  userServices,
};
