const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { sequelizePool } = require('../../connections/mysql');
const models = require('../../models');
const auditLogHelper = require('../../helpers/common/auditLog');
const responseHelper = require('../../helpers/common/response');

const createMovieSchema = Joi.object({
  name: Joi.string().required(),
  releaseDate: Joi.date().required(),
});

const createMovieSchemaValidator = validator.body(createMovieSchema);

const deleteMovieSchema = Joi.object({
  movieId: Joi.number().required(),
});

const deleteMovieSchemaValidator = validator.body(deleteMovieSchema);

const movieServices = {
  createMovie: async (req, res, next) => {
    const { name, releaseDate } = req.body;

    try {
      const movie = await models.Movie.create({
        name,
        releaseDate,
      });

      res.response = {
        data: movie,
      };

      await auditLogHelper.insertAuditLog({
        userId: req.user.userId,
        movieId: movie.id,
        detail: `create a movie, detail = ${req.body}`,
      });
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.CREATE_MOVIE_FAILURE,
      };
    }
    return next();
  },

  getMovieList: async (req, res, next) => {
    const {
      offset,
      limit,
    } = req.params;

    try {
      const movie = await models.Movie.findAndCountAll({
        offset: offset ? parseInt(offset, 10) : 0,
        limit: limit ? parseInt(limit, 10) : 0,
        order: [['releaseDate', 'DESC']],
      });
      res.response = {
        data: {
          count: movie.count,
          movies: movie.rows,
        },
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.GET_MOVIE_LIST_FAILURE,
      };
    }

    return next();
  },

  getMovieInfoById: async (req, res, next) => {
    const { movieId } = req.params;
    try {
      const movie = await models.Movie.findByPk(movieId);

      res.response = {
        data: movie,
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.GET_MOVIE_FAILURE,
      };
    }
    return next();
  },

  updateMovieInfoById: async (req, res, next) => {
    const { movieId } = req.params;
    try {
      await models.Movie.update(req.updateData, {
        where: { id: movieId },
      });

      const movie = await models.Movie.findByPk(movieId);
      res.response = {
        data: movie,
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.UODATE_MOVIE_FAILURE,
      };
    }

    return next();
  },

  removeMovieInfoById: async (req, res, next) => {
    const { movieId } = req.params;
    try {
      await models.Movie.destroy({ where: { id: movieId } });

      res.response = {
        msg: responseHelper.RESPONSE_MSG.DELETE_MOVIE_SUCCESS,
        data: {
          movieId,
        },
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: responseHelper.RESPONSE_MSG.DELETE_MOVIE_FAILURE,
      };
    }
    return next();
  },

  updateMovieRating: async (req, res, next) => {
    const {
      movieId,
      orignalRating,
      rating,
      isDeleted = false,
      isUpdated = false,
    } = req.ratingData;

    const transaction = await sequelizePool.transaction();

    try {
      const movie = await models.Movie.findByPk(movieId, { transaction });
      let {
        avgRating,
        ratingCount,
      } = movie;

      if (isUpdated) {
        avgRating = ((avgRating * ratingCount) - orignalRating + rating) / ratingCount;
      } else if (isDeleted) {
        if (ratingCount - 1 === 0) {
          ratingCount = 0;
          avgRating = 0;
        } else {
          avgRating = ((avgRating * ratingCount) - rating) / (ratingCount - 1);
          ratingCount -= 1;
        }
      } else {
        avgRating = ((avgRating * ratingCount) + rating) / (ratingCount + 1);
        ratingCount += 1;
      }

      await models.Movie.update(
        {
          avgRating,
          ratingCount,
        }, {
          where: { id: movieId },
          transaction,
        },
      );

      await transaction.commmit();
    } catch (err) {
      console.log(err.message);
    }
    return next();
  },
};

module.exports = {
  createMovieSchemaValidator,
  deleteMovieSchemaValidator,
  movieServices,
};
