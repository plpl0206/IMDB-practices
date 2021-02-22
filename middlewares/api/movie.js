const date = require('../../helpers/common/date');

module.exports = {
  checkMovieUpdateData: async (req, res, next) => {
    const {
      name,
      releaseDate,
    } = req.body;

    const updateData = {};

    if (name != null) {
      Object.assign(updateData, { name });
    }

    if (releaseDate != null) {
      Object.assign(updateData, { releaseDate: date.getTimestamp(releaseDate) });
    }

    Object.assign(req, { updateData });

    return next();
  },
};
