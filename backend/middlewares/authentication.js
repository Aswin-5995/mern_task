module.exports = (allowedRoles) => (req, res, next) => {
  const role = req.headers.role;
  if (!allowedRoles.includes(role)) {
    console.log("role",role)
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};
