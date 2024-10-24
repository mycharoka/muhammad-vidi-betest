const express = require('express')
const router = express.Router()
const controller = require('./controller/controller.js')
const {validatorRegister, validateRequest, validatorLogin} = require('./middleware/validator.js')
const verifyToken = require('./middleware/jwt.js')

router.get('/hello', (req, res) => {
  res.send('hello api')
})
router.post('/auth/register',
  validatorRegister,
  validateRequest,
  controller.register
)

router.post('/auth/login',
  validatorLogin,
  validateRequest, 
  controller.login
)

router.get('/auth/find/:id',
  verifyToken, 
  controller.getUserById
)

router.get('/auth/profile', 
  verifyToken,
  controller.getProfile
)

router.patch('/auth/update',
  verifyToken,
  controller.updateUser
)

router.delete('/auth/delete',
  verifyToken,
  controller.deleteUser
)

module.exports = router