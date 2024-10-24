const bcrypt = require('bcryptjs')
const {redisPublish, redisSubscribe, redisCache} = require('../config/redis')
const jwt = require('jsonwebtoken')
const Cypher = require('../helper/encrypt')

async function register(req, res) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashedPassword

    const payload = {
      action: 'insert',
      ...req.body
    }

    await redisPublish.publish('auth', JSON.stringify(payload))


    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('auth_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
  });


    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      message: responseMsg.message
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }

}

async function login(req, res) {
  try {
    const payload = {
      action: 'validate',
      ...req.body
    }
    await redisPublish.publish('auth', JSON.stringify(payload))

    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('validate_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
    });

    if (responseMsg.statusCode === 400 && responseMsg.message === 'User Not Found') {
      return res.status(responseMsg.statusCode).send({
        status: responseMsg.status,
        message: 'Username of Email Not Found'
      })

    }

    const passwordMatch = await bcrypt.compare(req.body.password, responseMsg.data.password)

    if (!passwordMatch) {
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid Password'
      })
    }

    const tokenPayload = {
      id: responseMsg.data._id,
      username: responseMsg.data?.username,
      email: responseMsg.data?.email
    }

    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || 'secret', {
      expiresIn: '24h'
    })

    await redisCache.set(`user:${responseMsg.data._id}`, JSON.stringify({...tokenPayload, token}), 'EX', 60 * 60 * 24)

    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      data: {
        ...tokenPayload,
        token
      }
    })
    
  } catch (error) {
    return res.status(500).send(error)
  }

}

async function getUserById(req, res) {
  const findOnRedis = await redisCache.get(`user:${req.params.id}`)

  if (findOnRedis !== null) {
    const data = JSON.parse(findOnRedis)
    return res.status(200).send({
      status: 'success',
      data: {
        id: data.id,
        username: data.username,
        email: data.email
      }
    })
  }  
  const payload = {
    action: 'get',
    data: req.params
  }

  try {
    await redisPublish.publish('auth', JSON.stringify(payload))

    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('fetch_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
    });


    await redisCache.set(`user:${responseMsg.data._id}`, JSON.stringify({
      id: responseMsg.data._id,
      username: responseMsg.data?.username,
      email: responseMsg.data?.email
    }), 'EX', 60 * 60 * 24)

    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      data: {
        id: responseMsg.data._id,
        username: responseMsg.data?.username,
        email: responseMsg.data?.email
      }
    })
    
  } catch (error) {
    return res.status(500).send(error)
  }
}

async function updateUser(req, res) {
  try {
    console.log(req.user)
    console.log(req.query)

    await redisPublish.publish('auth', JSON.stringify({
      action: 'update',
      data: {
        ...req.query,
        id: req.user.id
      }
    }))

    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('update_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
    });

    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      message: 'Update Success'
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}


async function getProfile(req, res) {
  try {
    const findOnRedis = await redisCache.get(`user:${req.user.id}`)

    if (findOnRedis !== null) {
      const data = JSON.parse(findOnRedis)
      return res.status(200).send({
        status: 'success',
        data: {
          id: data.id,
          username: data.username,
          email: data.email
        }
      })
    }

    const payload = {
      action: 'get',
      data: req.user
    }

    await redisPublish.publish('auth', JSON.stringify(payload))

    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('fetch_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
    });

    await redisCache.set(`user:${responseMsg.data._id}`, JSON.stringify({
      id: responseMsg.data._id,
      username: responseMsg.data?.username,
      email: responseMsg.data?.email
    }), 'EX', 60 * 60 * 24)

    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      data: {
        id: responseMsg.data._id,
        username: responseMsg.data?.username,
        email: responseMsg.data?.email
      }
    })
    
  } catch (error) {
    return res.status(500).send(error)
  }
}

async function deleteUser(req, res) {
  try {
    await redisPublish.publish('auth', JSON.stringify({
      action: 'delete',
      data: req.user
    }))

    const responseMsg = await new Promise((resolve, reject) => {
      let handledResponse = false;
  
      const timeout = setTimeout(() => {
          if (!handledResponse) {
              handledResponse = true;
              reject(new Error("Redis response timeout"));
          }
      }, 5000); // Set timeout 5 detik
      
      redisSubscribe.subscribe('delete_response', (message) => {
          if (!handledResponse) {
              clearTimeout(timeout);
              handledResponse = true;
              const msg = JSON.parse(message);
              resolve(msg);
          }
      });
    });

    return res.status(responseMsg.statusCode).send({
      status: responseMsg.status,
      message: responseMsg.message,
      data: req.user
    })
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  getProfile,
  deleteUser
}