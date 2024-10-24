const {validationResult, body, oneOf} = require('express-validator')


const validatorRegister = [
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

const validatorLogin = [
  // Check if at least one of username or email exists
  body(['username', 'email'])
    .optional()
    .custom((value, { req }) => {
      if (!req.body.username && !req.body.email) {
        throw new Error('Either username or email is required');
      }
      return true;
    }),

  // Username validation - only if username is provided
  body('username')
    .optional()  // Make it optional
    .isString()
    .notEmpty()
    .withMessage('username must be a string'),

  // Email validation - only if email is provided
  body('email')
    .optional()  // Make it optional
    .isEmail()
    .notEmpty()
    .withMessage('email must be a valid email'),

  // Password validation - always required
  body('password')
    .isString()
    .notEmpty()
    .withMessage('password must be a string')
];

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

module.exports = {
  validateRequest,
  validatorRegister,
  validatorLogin
}