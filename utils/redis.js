import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = true;

    this.client.on('connect', () => {
      this.isConnected = true;
    });
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err.message}`);
      this.isConnected = false;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
