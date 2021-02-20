const express = require('express');
const {
  genAuthorizaion,
} = require('../../services/api/sign_in');
const {
  createUserSchemaValidator,
  createUser,
} = require('../../services/api/sign_up');

const { handleResponse } = require('../../services/common/response');
const joiErrorHandle = require('../../middlewares/joi_error_handle');

const router = express.Router();

router.post(
  '',
  createUserSchemaValidator,
  joiErrorHandle,
  createUser,
  genAuthorizaion,
  handleResponse,
);

module.exports = router;
