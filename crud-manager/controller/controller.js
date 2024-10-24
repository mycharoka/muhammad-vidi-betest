const bcrypt = require('bcryptjs')
const redisClient = require('../config/redis')

async function register(req, res) {
  redisClient.on('error', (err) => {
    console.log('Redis Error', err)
  })
  try {
    await redisClient.connect()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashedPassword

    const payload = {
      action: 'insert',
      ...req.body
    }

    const registered = await redisClient.publish('auth', JSON.stringify(payload))

    console.log(`registered process: ${registered}`)

    const responseMsg = await new Promise((resolve, reject) => {
      redisClient.subscribe('auth_response', message => {
        const msg = JSON.parse(message)
        resolve(msg)
      })
    })

    console.log('responseeeee>>> ', responseMsg)
    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      message: responseMsg.message
    })
  } catch (error) {
    return res.status(500).send(error)
  }
  
}

async function login(req, res) {}

module.exports = {
  register,
  login
}