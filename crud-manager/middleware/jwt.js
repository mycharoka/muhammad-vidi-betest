const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send({ message: 'Token not provided' })
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.SECRET_KEY || 'secret')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({message: 'Invalid Token'})
  }
}

module.exports = verifyToken