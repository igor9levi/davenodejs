const bcrypt = require('bcrypt');

const User = require('../models/User');

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required!' });
  }

  // Need to add exec() at the end of .findOne, because we use await
  const duplicateUser = await User.findOne({ username: user }).exec();

  // TODO: Check if username already exists in DB
  if (duplicateUser) {
    return res.status(409); // Conflict
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    await User.create({
      username: user,
      password: hashedPwd,
    });

    res
      .status(201)
      .json({ status: `New user created with username of ${user}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
