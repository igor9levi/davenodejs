const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required!' });
  }

  // TODO: Check if username already exists in DB
  if (duplicateUser) {
    return res.status(409); // Conflict
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = {
      username: user,
      password: hashedPwd,
      roles: { user: 2001 },
    };

    // TODO: store newUser in DB
    res
      .status(201)
      .json({ status: `New user created with username of ${user}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
