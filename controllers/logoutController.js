const User = require('../models/User');

const handleLogout = async (req, res) => {
  // TODO: on client also delete AT
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // Success - No content
  }

  const refreshToken = cookies.jwt;

  // Is RT user in DB
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    }); // for clear cookie, need to pass same options as with creating
    return res.sendStatus(204);
  }

  // Delete RT from DB
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (token) => token !== refreshToken
  );
  await foundUser.save();

  res.clearCookie('jwt', {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
