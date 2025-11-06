const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// ✅ Verify token & attach user
function verifyToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ msg: "Token missing" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid Token" });

    req.user = { email: decoded.email, role: decoded.role, userId: decoded.userId || decoded.id }; // extract email, role and userId from token
    next();
  });
}

// ✅ Admin check
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
  });
}

module.exports = { verifyToken, verifyAdmin };
