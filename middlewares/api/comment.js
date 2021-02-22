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
};
