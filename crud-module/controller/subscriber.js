  const controller = require('./controller');
const {redisSubscriber} = require('../config/redis');


redisSubscriber.on('error', (error) => {
  console.error(`Error in Redis Subscriber: ${error}`);
});
async function startSubscriber() {
  try {
    // await redisClient.connect();
    await redisSubscriber.subscribe('auth', (message) => {
      console.log(`Received message on channel 'auth': ${message}`);
      // Tambahkan logika untuk memproses pesan di sini jika diperlukan
      const parseMessage = JSON.parse(message)
      console.log('parsing message > ', parseMessage)
      if (parseMessage.action === 'insert') {
          console.log('insert')
          controller.register(parseMessage)
      }
      if (parseMessage.action === 'update') {
          console.log('update')
      }
      if (parseMessage.action === 'delete') {
          console.log('delete')
      }
  });
  } catch (error) {
    console.error(`Error in Redis Subscriber: ${error}`);
  }
}

module.exports = {
  startSubscriber
}