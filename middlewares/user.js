const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { redis } = require('../connections/redis');
const models = require('../models');

const authSchema = Joi.object({
  userId: Joi.string().required(),
  userToken: Joi.string().required(),
});

const middlewares = {
  ensureAuthenticated: async (req, res, next) => {
    const auth = authSchema.validate({
      userId: req.get('user_id'),
      userToken: req.get('user_token'),
    });

    if (auth.error) {
      res.status(401).json({
        msg: 'UNAUTHORIZED',
      });
      return;
    }

    const user = await models.User.getUserById(auth.value.userId);

    if (user === null) {
      res.status(401).json({
        msg: 'USER NOT EXISTS',
      });
      return;
    }

    const userToken = await redis.master.get(`token:${auth.value.userId}`);

    if (userToken === auth.value.userToken) {
      await redis.master.expire(`token:${auth.value.userId}`, 86400 * 7);
      const secret = config.auth.parameter.jwt_secret;
      jwt.verify(userToken, secret);

      req.logIn(user, { session: false });
    }

    if (req.isAuthenticated()) {
      return next();
    }

    res.status(401).json({
      msg: 'UNAUTHORIZED',
    });
  },
};

module.exports = middlewares;
