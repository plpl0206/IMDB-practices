const express = require('express');
const { handleResponse } = require('../../services/common/response');
const { ensureAuthenticated } = require('../../middlewares/user');
const joiErrorHandle = require('../../middlewares/joi_error_handle');
const movieMiddleware = require('../../middlewares/api/movie');
const {
  createMovieSchemaValidator,
  movieServices,
} = require('../../services/api/movie');

const router = express.Router();

router.get(
  '',
  movieServices.getMovieList,
  handleResponse,
);

router.get(
  '/:movieId',
  movieServices.getMovieInfoById,
  handleResponse,
);

router.post(
  '',
  ensureAuthenticated,
  createMovieSchemaValidator,
  joiErrorHandle,
  movieServices.createMovie,
  handleResponse,
);

router.put(
  '/:movieId',
  ensureAuthenticated,
  movieMiddleware.checkMovieUpdateData,
  movieServices.updateMovieInfoById,
  handleResponse,
);

router.delete(
  '/:movieId',
  ensureAuthenticated,
  movieServices.removeMovieInfoById,
  handleResponse,
);

module.exports = router;
