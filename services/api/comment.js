const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { sequelizePool } = require('../../connections/mysql');
const models = require('../../models');
const auditLogHelper = require('../../helpers/common/auditLog');

const createCommentSchema = Joi.object({
  movieId: Joi.number().required(),
  rating: Joi.number().required(),
});

const createCommentSchemaValidator = validator.body(createCommentSchema);

const commetServices = {

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
        detail: `create a comment of a movie, detail = ${req.body}`,
      });
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'CREATE COMMENT INFO FAIL',
      };
    }
    return next();
  },

  updateCommentById: async (req, res, next) => {
    const { commentId } = req.params;

    try {
      const orignalRating = req.updateData.rating;

      await models.Comment.update(req.updateData, {
        where: { id: commentId },
      });

      const comment = await models.Comment.findByPk(commentId);

      if (orignalRating) {
        const {
          movieId,
          rating,
        } = comment;

        req.ratingData = {
          movieId,
          orignalRating,
          rating,
          isUpdated: true,
        };
      }

      res.response = {
        data: comment,
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'UPDATE COMMENT FAIL',
      };
    }

    return next();
  },

  removeCommentById: async (req, res, next) => {
    const { commentId } = req.params;

    try {
      const transaction = await sequelizePool.transaction();
      const comment = await models.Comment.findByPk(commentId, { transaction });

      await models.Comment.destroy({
        where: { id: commentId },
        transaction,
      });

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
        msg: 'DELETE COMMENT SUCCESS',
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'DELETE COMMENT FAIL',
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
      const comment = await models.Comment.findAndCountAll({
        where: { movieId },
        offset: offset ? parseInt(offset, 10) : 0,
        limit: limit ? parseInt(limit, 10) : 0,
        order: [['releaseDate', 'DESC']],
      });
      res.response = {
        data: {
          count: comment.count,
          comments: comment.rows,
        },
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'GET COMMENT LIST FAIL',
      };
    }
    return next();
  },

};

module.exports = {
  createCommentSchemaValidator,
  commetServices,
};
