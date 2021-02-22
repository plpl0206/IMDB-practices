const express = require('express');
const { handleResponse } = require('../../services/common/response');
const { ensureAuthenticated } = require('../../middlewares/user');
const userMiddleware = require('../../middlewares/api/user');
const { userServices } = require('../../services/api/user');
const {
  removeAuthorizaion,
} = require('../../services/api/sign_in');

const router = express.Router();

router.get(
  '',
  ensureAuthenticated,
  userServices.getUserInfo,
  handleResponse,
);

router.put(
  '',
  ensureAuthenticated,
  userMiddleware.checkUserUpdateData,
  userServices.updateUserInfo,
  handleResponse,
);

router.delete(
  '',
  ensureAuthenticated,
  userServices.removeUserInfo,
  removeAuthorizaion,
  handleResponse,
);

module.exports = router;
