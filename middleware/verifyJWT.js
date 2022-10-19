const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.sendStatus(401); // Unauthorized - client provides no credentials or invalid credentials
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      res.sendStatus(403); // invalid token - Forbidden access
    }

    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
