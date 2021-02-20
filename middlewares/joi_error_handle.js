module.exports = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      msg: err.error.toString(),
    });
  } else {
    next();
  }
};
