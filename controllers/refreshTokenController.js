const { usersDB } = require('./authController');

const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv').config();
// const path = require('path');

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  //TODO: find user in DB
  const foundUser = usersDB.users.find(
    (usr) => usr.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(401); // Not Authorized
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err || decoded.username !== foundUser.username) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken, usersDB };
