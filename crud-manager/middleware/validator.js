const {validationResult, body} = require('express-validator')


const validator = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('username must be a string'),
  body('email')
    .isEmail()
    .withMessage('email must be a valid email'),
  body('password')
    .isString()
    .withMessage('password must be a string'),
  body('account_number')
    .isString()
    .notEmpty()
    .withMessage('account_number must be a string'),
  body('identity_number')
    .isString()
    .notEmpty()
    .withMessage('identity_number must be a string'),
]

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = {
  validateRequest,
  validator
}