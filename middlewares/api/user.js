const bcrypt = require('bcrypt');

module.exports = {
  checkUserUpdateData: async (req, res, next) => {
    const {
      username,
      password,
    } = req.body;

    const updateData = {};

    if (username != null) {
      Object.assign(updateData, { username });
    }

    if (password != null) {
      Object.assign(updateData, { password: await bcrypt.hash(password, 10) });
    }

    Object.assign(req, { updateData });

    return next();
  },
};
