const express = require('express')
const router = express.Router()
const controller = require('./controller/controller.js')
const {validator, validateRequest} = require('./middleware/validator.js')

router.get('/hello', (req, res) => {
  res.send('hello api')
})
router.post('/auth/register',
  validator,
  validateRequest,
  controller.register
)

router.post('/auth/login', controller.login)

module.exports = router