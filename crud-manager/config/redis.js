const Redis = require('redis')

const redisClient = Redis.createClient({
  url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

module.exports = redisClient