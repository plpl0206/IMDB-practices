const models = require('../models');

const movieHelper = {

  HELPER_PARAMETERS: {
    MOVIE_LIST_OFFSET_DEFAULT: 0,
    MOVIE_LIST_LIMIT_DEFAULT: 100,
    MOVIE_LIST_ORDER_DEFAULT: [['releaseDate', 'DESC']],
  },

  async getMovieList(offset = this.HELPER_PARAMETERS.MOVIE_LIST_OFFSET_DEFAULT,
    limit = this.HELPER_PARAMETERS.MOVIE_LIST_LIMIT_DEFAULT,
    order = this.HELPER_PARAMETERS.MOVIE_LIST_ORDER_DEFAULT) {
    const movies = await models.Movie.findAll({
      offset,
      limit,
      order,
    });
    return movies;
  },
};

module.exports = movieHelper;
