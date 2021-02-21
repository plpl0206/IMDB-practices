const response = {
  handleResponse: async (req, res) => {
    res.response = res.response || {};
    const {
      type = 'application/json',
      code,
      msg,
      data = {},
    } = res.response;
    res.set('Content-Type', type);
    res.send({ code, msg, data });
  },
};

module.exports = response;
