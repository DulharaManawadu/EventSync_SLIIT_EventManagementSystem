const jwt = require('jsonwebtoken');

const QR_TOKEN_SECRET =
  process.env.QR_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  'eventsync_qr_secret';

function signRegistrationQrToken(payload) {
  return jwt.sign(payload, QR_TOKEN_SECRET, { noTimestamp: false });
}

function verifyRegistrationQrToken(token) {
  return jwt.verify(token, QR_TOKEN_SECRET);
}

module.exports = {
  signRegistrationQrToken,
  verifyRegistrationQrToken
};
