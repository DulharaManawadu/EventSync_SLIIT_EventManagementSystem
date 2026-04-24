const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'eventsync_super_secret';

function sendJwtError(res, error) {
  if (error?.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired. Please log in again.',
      code: 'TOKEN_EXPIRED',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  if (error?.name === 'JsonWebTokenError' || error?.name === 'NotBeforeError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      code: 'INVALID_TOKEN',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  console.error('Auth Middleware Unexpected Error:', error);
  return res.status(401).json({
    success: false,
    message: 'Authentication failed',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}

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
    return sendJwtError(res, error);
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
      return sendJwtError(res, error);
    }
  };
}

module.exports = {
  requireAuth,
  requireRole
};
