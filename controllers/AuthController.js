const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { generateHash } = require('../utils/helpers');

class AuthController {
  static async getConnect(req, res) {
    const { email, password } = req.user;
    const user = await dbClient.getUserByEmailAndPassword(
      email,
      generateHash(password),
    );
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, `${user._id}`, 86400);

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const bearertoken = req.headers['x-token'];
    await redisClient.del(`auth_${bearertoken}`);
    res.status(204).end();
  }

  static getMe(req, res) {
    const { user } = req;
    res.status(200).json({ id: user._id, email: user.email });
    res.end();
  }
}

module.exports = AuthController;
