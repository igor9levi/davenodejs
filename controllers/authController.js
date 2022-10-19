const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleLogin = async (req, res) => {
  /**
   * We might have a cookie when we try to login e.g.
   *    1. RT expires
   *    2. We go to login without loging out
   *    3. We still have cookie with JWT & RT set
   * */
  const cookies = req.cookies;
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required!' });
  }

  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden - client has valid credentials but not enough privileges to perform an action on a resource
  }

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    // Create JWTa (AT & RT)
    const accessToken = jwt.sign(
      { userInfo: { username: foundUser.username, roles } },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' }
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1d' }
    );

    let newRefreshTokenArray = !cookies.jwt
      ? foundUser.refreshToken // If no token in cookies, use only RTs from DB and no old RT do delete from DB
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt); // If RT exists in cookie remove it from DB

    // If recieved cookie in auth controller, delete it
    if (cookies?.jwt) {
      /**
       *  Scenario 3:
       *    1. User logs but never uses RT & does not logout
       *    2. RT stolen
       *    3. If 1 & 2 add reuse detection is needed to clear all RTs when user logs in
       */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detect refresh token reuse because if User hasn't used his RT, RT should be in an array
      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      });
    }

    // TODO: Save RT to DB and create /logout route to invalidate it and for cross-reference
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]; // In case scenario 3 we're deleting other tokens WITH Hacked token, and issue new one with this login
    await foundUser.save();

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15min in ms;
      /**
       * On production also add secure: true to be able to send via https
       * Required by Chrome and for PROD, may create issues with testing refresh API with Thunderclient
       */
      secure: true,
      sameSite: 'None', // For httpOnly cookie to be accepted by CORS, since FE is usually served from other domain
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unauthorized - client provides no credentials or invalid credentials
  }
};

module.exports = { handleLogin };
