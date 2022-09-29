const { usersDB } = require('./authController');

const handleLogout = (req, res) => {
  // TODO: on client delete AT
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // Success - No content
  }

  const refreshToken = cookies.jwt;

  // Is RT user in DB
  const foundUser = usersDB.users.find(
    (usr) => usr.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'None',
      secure: true,
    }); // for clear cookie, need to pass same options as with creating
    return res.sendStatus(204);
  }

  const otherUsers = usersDB.users.filter(
    (usr) => usr.refreshToken !== refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: '' };
  usersDB.setUsers([...otherUsers, currentUser]);

  res.clearCookie('jwt', {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout, usersDB };
