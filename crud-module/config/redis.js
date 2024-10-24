const Redis = require('redis')

const redisClient = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` // Sesuaikan host dan port
});

// Create the Redis client for publishing
const redisPublisher = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Create the Redis client for subscribing (if needed elsewhere in your app)
const redisSubscriber = Redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Remember to connect the clients before using them
(async () => {
  await redisPublisher.connect();  // Connect the publisher
  await redisSubscriber.connect(); // Connect the subscriber
  await redisClient.connect()
})();

// Export both clients for use in other parts of your app
module.exports = { redisPublisher, redisSubscriber, redisClient };
