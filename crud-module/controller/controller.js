const {redisPublisher, redisClient} = require('../config/redis')
const User = require('../models/userSchema')

async function register(data) {
  try {

    const newUser = new User({
      username: data.username,
      email: data.email,
      password: data.password,
      account_number: data.account_number,
      identity_number: data.identity_number
    })

    const isUserExist = await User.findOne({ 
      email: data.email, 
      username: data.username, 
      account_number: data.account_number,
      identity_number: data.identity_number 
      })
    
    if (isUserExist) {
      return await redisClient.publish('auth_response', JSON.stringify({ 
        action: 'insert', 
        status: 'failed', 
        statusCode: 400, 
        message: 'User Already Exist' 
        })
      )
    }

    await newUser.save()
    .then(() => console.log('Data Saved'))
    .catch((err) => console.log(err))
    

    await redisClient.publish('auth_response', JSON.stringify({ 
      action: 'insert',
      status: 'success', 
      statusCode: 200,
      message: 'User Registered' 
    }))
    await redisClient.quit()
  } catch (error) {
    await redisClient.publish('auth_response', JSON.stringify({ 
      action: 'insert', 
      status: 'failed', 
      statusCode: 400,
      message: error 
    })
  )
  }
}

module.exports = {
  register
}