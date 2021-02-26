const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { sequelizePool } = require('../../connections/mysql');
const models = require('../../models');
const movieHelper = require('../../helpers/movie');
const { websocketHelper, EVENT } = require('../../helpers/websocket');
const auditLogHelper = require('../../helpers/common/auditLog');
const responseHelper = require('../../helpers/common/response');

const createMovieSchema = Joi.object({
  name: Joi.string().required(),
  releaseDate: Joi.date().required(),
});

const createMovieSchemaValidator = validator.body(createMovieSchema);

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
        detail: `create a movie, detail = ${JSON.stringify(req.body)}`,
      });

      websocketHelper.ioBroadcast(EVENT.NEW_MOVIE, {
        userId: req.user.userId,
        movie,
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
    let {
      offset,
      limit,
    } = req.query;

    try {
      offset = offset ? parseInt(offset, 10) : 0;
      limit = limit ? parseInt(limit, 10) : 0;
      const movies = await movieHelper.getMovieList(offset, limit);

      res.response = {
        data: {
          count: movies.length,
          movies,
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

      websocketHelper.ioBroadcast(EVENT.UPDATE_MOVIE, {
        userId: req.user.userId,
        movie,
      });

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

    const transaction = await sequelizePool.mariadb.transaction();
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

      await transaction.commit();
    } catch (err) {
      console.log(err.message);
      await transaction.rollback();
    }
    return next();
  },
};

module.exports = {
  createMovieSchemaValidator,
  movieServices,
};
