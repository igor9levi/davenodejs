const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401); // Unauthorised - client provides no credentials or invalid credentials
    }
    const rollesArray = [...allowedRoles];
    const isRoleAcceptable = req.roles
      .map((role) => rollesArray.includes(role))
      .find((value) => value === true);

    if (!isRoleAcceptable) {
      return res.sendStatus(401); // UnAuthorized - client provides no credentials or invalid credentials
    }
    next();
  };
};

module.exports = verifyRoles;
