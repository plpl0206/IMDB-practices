const express = require('express');
const { handleResponse } = require('../../services/common/response');
const { ensureAuthenticated } = require('../../middlewares/user');
const userMiddleware = require('../../middlewares/api/user');
const {
  getUserInfo,
  updateUserInfo,
  removeUserInfo,
} = require('../../services/api/user');
const {
  removeAuthorizaion,
} = require('../../services/api/sign_in');

const router = express.Router();

router.get(
  '',
  ensureAuthenticated,
  getUserInfo,
  handleResponse,
);

router.put(
  '',
  ensureAuthenticated,
  userMiddleware.checkUserUpdateData,
  updateUserInfo,
  handleResponse,
);

router.delete(
  '',
  ensureAuthenticated,
  removeUserInfo,
  removeAuthorizaion,
  handleResponse,
);

module.exports = router;
