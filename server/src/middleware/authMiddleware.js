const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eventsync_super_secret';

function getAuthToken(req) {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization) return null;
  const parts = authorization.split(' ');
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
}

function requireAuth(req, res, next) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    try {
      const token = getAuthToken(req);
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No authentication token provided'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.userType) {
        return res.status(403).json({
          success: false,
          message: "Sorry, you don't have proper authorization for this feature"
        });
      }

      if (!roles.includes(decoded.userType)) {
        return res.status(403).json({
          success: false,
          message: "Sorry, you don't have proper authorization for this feature"
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Role Middleware Error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
}

module.exports = {
  requireAuth,
  requireRole
};
