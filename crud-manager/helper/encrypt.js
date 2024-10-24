const crypto = require('crypto');

function generateHash(token, key) {
  const combine = token + key
  const hash = crypto.createHash('sha256').update(combine).digest('hex');
  return hash
}

module.exports = {generateHash}