const express = require('express');
const { handleResponse } = require('../../services/common/response');
const { ensureAuthenticated } = require('../../middlewares/user');
const joiErrorHandle = require('../../middlewares/joi_error_handle');
const commentMiddleware = require('../../middlewares/api/comment');
const { movieServices } = require('../../services/api/movie');

const {
  createCommentSchemaValidator,
  commetServices,
} = require('../../services/api/comment');

const router = express.Router();

router.get(
  '/:movieId/offset/:offset/limit/:limit',
  commetServices.getCommentListByMovieId,
  handleResponse,
);

router.post(
  '',
  ensureAuthenticated,
  createCommentSchemaValidator,
  joiErrorHandle,
  commetServices.createComment,
  movieServices.updateMovieRating,
  handleResponse,
);

router.put(
  '/:commentId',
  ensureAuthenticated,
  commentMiddleware.checkCommentUpdateData,
  commetServices.updateCommentById,
  movieServices.updateMovieRating,
  handleResponse,
);

router.delete(
  '/:commentId',
  ensureAuthenticated,
  commetServices.removeCommentById,
  movieServices.updateMovieRating,
  handleResponse,
);

module.exports = router;
