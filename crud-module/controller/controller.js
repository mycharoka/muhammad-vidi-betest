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
      $or: [
        {username: data.username},
        {email: data.email},
        {account_number: data.account_number},
        {identity_number: data.identity_number}
      ],
    })
    
    if (isUserExist) {
    await redisClient.publish('auth_response', JSON.stringify({ 
        action: 'insert', 
        status: 'failed', 
        statusCode: 400, 
        message: 'User Already Exist' 
        })
      )
      return
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

async function validate(data) {
  try {
    const findUser = await User.findOne({
      $or: [
        {username: data.username},
        {email: data.email}
      ]
    })

    if (!findUser) {
      await redisClient.publish('validate_response', JSON.stringify({
        action: 'validate',
        status: 'failed',
        statusCode: 400,
        message: 'User Not Found'
      }))
    }

    await redisClient.publish('validate_response', JSON.stringify({
      action: 'validate',
      status: 'success',
      statusCode: 200,
      message: 'User Found',
      data: findUser
    }))
  } catch (error) {
    await redisClient.publish('validate_response', JSON.stringify({ 
      action: 'validate', 
      status: 'failed', 
      statusCode: 400, 
      message: error 
    }));
  }
}  

async function get(data) {
  try {
    const findUser = await User.findOne({
      _id: data.data.id
    })

    if (!findUser) {
      await redisClient.publish('fetch_response', JSON.stringify({
        action: 'get',
        status: 'failed',
        statusCode: 400,
        message: 'User Not Found'
      }))
    }

    await redisClient.publish('fetch_response', JSON.stringify({
      action: 'get',
      status: 'success',
      statusCode: 200,
      message: 'User Found',
      data: findUser
    }))


  } catch (error) {
    await redisClient.publish('fetch_response', JSON.stringify({ 
      action: 'validate', 
      status: 'failed', 
      statusCode: 400, 
      message: error 
    }));
  }
}

async function update(data) {
  console.log('data update > ', data)
  try {
    const updateUser = await User.updateOne(
      {_id: data.data.id},
      {$set: {
        email: data.data.newEmail
      }}
    )
    await redisClient.publish('update_response', JSON.stringify({
      action: 'update',
      status: 'success',
      statusCode: 200,
      message: 'User Updated',
    }))
  } catch (error) {
    await redisClient.publish('update_response', JSON.stringify({ 
      action: 'validate', 
      status: 'failed', 
      statusCode: 400, 
      message: error 
    }));
  }
}

async function deleteUser(data) {
  try {
    const deleteQuery = await User.deleteOne({
      _id: data.data.id
    })
    console.log('delete query > ', deleteQuery)

    if (deleteQuery.deletedCount === 0) {
      await redisClient.publish('delete_response', JSON.stringify({
        action: 'delete',
        status: 'failed',
        statusCode: 400,
        message: 'User Not Found'
      }))
    }

    await redisClient.publish('delete_response', JSON.stringify({
      action: 'delete',
      status: 'success',
      statusCode: 200,
      message: 'User Deleted',
    }))
  } catch (error) {
    await redisClient.publish('delete_response', JSON.stringify({ 
      action: 'validate', 
      status: 'failed', 
      statusCode: 400, 
      message: error 
    }));
  }
}

module.exports = {
  register,
  validate,
  get,
  update,
  deleteUser
}