const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});

const models = require('../../models');

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
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'CREATE MOVIE INFO FAIL',
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
        code: 500,
        msg: 'GET MOVIE LIST FAIL',
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
        code: 500,
        msg: 'GET MOVIE INFO FAIL',
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
        code: 500,
        msg: 'UPDATE MOVIE FAIL',
      };
    }

    return next();
  },

  removeMovieInfoById: async (req, res, next) => {
    const { movieId } = req.params;
    try {
      await models.Movie.destroy({ where: { id: movieId } });

      res.response = {
        msg: 'DELETE MOVIE SUCCESS',
        data: {
          movieId,
        },
      };
    } catch (err) {
      console.log(err.message);
      res.response = {
        code: 500,
        msg: 'DELETE MOVIE INFO FAIL',
      };
    }
    return next();
  },
};

module.exports = {
  createMovieSchemaValidator,
  deleteMovieSchemaValidator,
  movieServices,
};
