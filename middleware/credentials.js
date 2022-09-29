const allowedOrigins = require('../config/allowedOrigins');

const checkCredentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Controll-Allow-Credentials', true);
  }
  next();
};

module.exports = checkCredentials;
