const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { sequelizePool } = require('../../connections/mysql');
const models = require('../../models');
const auditLogHelper = require('../../helpers/common/auditLog');
const responseHelper = require('../../helpers/common/response');

const createCommentSchema = Joi.object({
  movieId: Joi.number().required(),
  rating: Joi.number().required(),
  description: Joi.string(),
});

const createCommentSchemaValidator = validator.body(createCommentSchema);

const commentServices = {

  createComment: async (req, res, next) => {
    const { userId } = req.user;
    const {
      movieId,
      rating,
      description,
    } = req.body;

    try {
      const comment = await models.Comment.create({
        userId,
        movieId,
        rating,
        description,
      });

      req.ratingData = {
        movieId,
        rating,
        isDeleted: false,
      };

      res.response = {
        data: comment,
      };

      await auditLogHelper.insertAuditLog({
        userId,
        movieId,
        detail: `create a comment of a movie, detail = ${JSON.stringify(req.body)}`,
      });
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.CREATE_COMMENT_FAILURE,
      };
    }
    return next();
  },

  updateCommentById: async (req, res, next) => {
    const { commentId } = req.params;
    const { rating } = req.updateData;

    const transaction = await sequelizePool.mariadb.transaction();
    try {
      let comment = await models.Comment.findByPk(commentId);
      const { movieId } = comment;
      const orignalRating = comment.rating;

      await models.Comment.update(req.updateData, {
        where: { id: commentId },
      });

      comment = await models.Comment.findByPk(commentId);

      await transaction.commit();

      req.ratingData = {};
      if (rating) {
        Object.assign(req.ratingData, {
          movieId,
          orignalRating,
          rating,
          isUpdated: true,
        });
      }

      res.response = {
        data: comment,
      };
    } catch (err) {
      console.log(err.message);
      await transaction.rollback();
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.UPDATE_COMMENT_FAILURE,
      };
    }

    return next();
  },

  removeCommentById: async (req, res, next) => {
    const { commentId } = req.params;

    const transaction = await sequelizePool.mariadb.transaction();
    try {
      const comment = await models.Comment.findByPk(commentId, { transaction });

      await models.Comment.destroy({
        where: { id: commentId },
        transaction,
      });

      await transaction.commit();

      const {
        movieId,
        rating,
      } = comment;

      req.ratingData = {
        movieId,
        rating,
        isDeleted: true,
      };

      res.response = {
        msg: responseHelper.RESPONSE_MSG.DELETE_COMMENT_SUCCESS,
      };
    } catch (err) {
      console.log(err.message);
      await transaction.rollback();
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.DELETE_COMMENT_FAILURE,
      };
    }
    return next();
  },

  getCommentListByMovieId: async (req, res, next) => {
    const {
      movieId,
      offset,
      limit,
    } = req.params;

    try {
      const comments = await models.Comment.findAll({
        where: { movieId },
        offset: offset ? parseInt(offset, 10) : 0,
        limit: limit ? parseInt(limit, 10) : 0,
        order: [['createdAt', 'DESC']],
      });
      res.response = {
        data: {
          count: comments.length,
          comments,
        },
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.GET_COMMENT_LIST_FAILURE,
      };
    }
    return next();
  },

};

module.exports = {
  createCommentSchemaValidator,
  commentServices,
};
