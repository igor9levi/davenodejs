const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401); // Not authorised
    }
    const rollesArray = [...allowedRoles];
    const isRoleAcceptable = req.roles
      .map((role) => rollesArray.includes(role))
      .find((value) => value === true);

    if (!isRoleAcceptable) {
      return res.sendStatus(401); // Not Authorized
    }
    next();
  };
};

module.exports = verifyRoles;
