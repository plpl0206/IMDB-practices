module.exports = (err, req, res, next) => {
  if (err) {
    res.status(400).json({
      status: err.status,
      message: err.name,
    });
  } else {
    next();
  }
};
