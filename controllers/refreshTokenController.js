const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401); // Unauthorized - client provides no credentials or invalid credentials
  }

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }); // for clear cookie, need to pass same options as with creating

  const foundUser = await User.findOne({ refreshToken }).exec(); // Same query will also search a value in array prop refreshToken

  // Detected RT re-use (RT is not connected to a user)
  if (!foundUser) {
    // Decode username from RT and since it's re-use use-case here, delete all RTs for account named in JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) {
          // We receive an error if we cannot decode RT because e.g. it's expired
          return res.sendStatus(403);
        }
        // Here RT would be valid if it wasn't reused before
        // If no error means someone is trying to reuse RT - REUSE ATTEMPT
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();

        // Delete all RTs for each device
        hackedUser.refreshToken = [];

        const result = await hackedUser.save();
      }
    );
    return res.sendStatus(403); // Forbidden - client has valid credentials but not enough privileges to perform an action on a resource
  }

  // Here need to re-issue new RT, but first remove old token from DB
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    // Token is expired
    if (err) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      foundUser.save(); // save to DB
    }
    if (err || decoded.username !== foundUser.username) {
      return res.sendStatus(403); // Forbidden - client has valid credentials but not enough privileges to perform an action on a resource
    }

    // To decode JWT on FE use jwt-decode from Auth0

    // RT is valid here

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      { userInfo: { username: decoded.username, roles } },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' }
    );

    const newRefreshToken = jwt.sign(
      { username: { username: foundUser.username } },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1d' }
    );

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();

    // After saving RT in DB need to set RT in httpOnly cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None', // For httpOnly cookie to be accepted by CORS, since FE is usually served from other domain
    });

    res.json({ accessToken, roles }); // Since we send roles in AT we can decode AT on FE using jwt-decode npm package
  });
};

module.exports = { handleRefreshToken };
