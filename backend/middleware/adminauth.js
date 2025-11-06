const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config/.env' });
const SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => { 

try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    
    const decoded = jwt.verify(token, SECRET_KEY);     

    // Check role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
