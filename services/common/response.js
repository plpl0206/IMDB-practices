const response = {
  handleResponse: async (req, res) => {
    res.response = res.response || {};
    const {
      type = 'application/json',
      msg,
      data = {},
    } = res.response;
    res.set('Content-Type', type);
    res.send({ msg, data });
  },
};

module.exports = response;
