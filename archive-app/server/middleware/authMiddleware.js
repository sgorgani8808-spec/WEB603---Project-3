function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Please log in first." });
  }

  next();
}

function isAdmin(req, res, next) {
  if (req.session.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }

  next();
}

module.exports = {
  isAuthenticated,
  isAdmin
};