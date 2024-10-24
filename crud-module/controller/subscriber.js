  const controller = require('./controller');
const {redisSubscriber} = require('../config/redis');

async function startSubscriber() {
  try {
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
          controller.update(parseMessage)
      }
      if (parseMessage.action === 'delete') {
          console.log('delete')
          controller.deleteUser(parseMessage)
      }
      if (parseMessage.action === 'validate') {
        console.log('validate')
        controller.validate(parseMessage)
      }
      if (parseMessage.action === 'get') {
        console.log('get')
        controller.get(parseMessage)
      }
  });
  } catch (error) {
    console.error(`Error in Redis Subscriber: ${error}`);
  }
}

module.exports = {
  startSubscriber
}