const models = require('../../models');
const responseHelper = require('../../helpers/common/response');

module.exports = {
  checkCommentUpdateData: async (req, res, next) => {
    const {
      description,
      rating,
    } = req.body;

    const updateData = {};

    if (description != null) {
      Object.assign(updateData, { description });
    }

    if (rating != null) {
      Object.assign(updateData, { rating });
    }

    Object.assign(req, { updateData });

    return next();
  },

  checkMovieExisted: async (req, res, next) => {
    let { movieId } = req.params;
    movieId = movieId || req.body.movieId;
    try {
      if (!movieId) {
        res.json({
          code: responseHelper.RESPONSE_CODE.BAD_REQUEST,
          msg: responseHelper.RESPONSE_MSG.MOVIEID_FIELD_NOT_EXIST,
        });
        return;
      }
      const count = await models.Movie.count({ where: { id: movieId } });
      if (count === 0) {
        res.json({
          code: responseHelper.RESPONSE_CODE.BAD_REQUEST,
          msg: responseHelper.RESPONSE_MSG.MOVIE_NOT_EXIST,
        });
        return;
      }
    } catch (err) {
      console.log(err.message);
      res.json({
        code: responseHelper.RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        msg: err.original ? err.original.code : responseHelper.RESPONSE_MSG.INTERNAL_SERVER_ERROR,
      });
    }
    return next();
  },

};
