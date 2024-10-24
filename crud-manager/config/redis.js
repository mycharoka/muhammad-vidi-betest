const Redis = require('redis')

const redisPublish = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` // Sesuaikan host dan port
});
const redisSubscribe = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` // Sesuaikan host dan port
});
const redisCache = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` // Sesuaikan host dan port
});

(async () => {
  await redisPublish.connect()
  await redisSubscribe.connect()
  await redisCache.connect()
})();

module.exports = {redisPublish, redisSubscribe, redisCache}