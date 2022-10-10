const bcrypt = require('bcrypt');

const usersDB = require('../db/users');

const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv').config();
// const path = require('path');

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required!' });
  }

  //TODO: find user in DB
  const foundUser = usersDB.users.find((usr) => usr.username === user);

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // TODO: Create JWTa (AT & RT)
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: '30s' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN,
      { expiresIn: '1d' }
    );

    // TODO: Save RT to DB and create /logout route to invalidate it and for cross-reference
    const otherUsers = usersDB.users.filter((usr) => usr.username !== user);
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15min in ms;
      secure: true, // On production also add secure: true to be able to send via https
      sameSite: 'None', // For httpOnly cookie to be accepted by CORS, since FE is usually served from other domain
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
