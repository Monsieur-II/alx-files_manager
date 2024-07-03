const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const unAuthorized = { error: 'Unauthorized' };

const basicAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Basic ')) {
    res.status(401).json(unAuthorized);
    res.end();
    return;
  }
  const encoded = authorization.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const [email, password] = decoded.split(':');

  if (!email || !password) {
    res.status(401).json(unAuthorized);
    res.end();
    return;
  }
  req.user = { email, password };
  next();
};

const bearerAuth = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json(unAuthorized);
    res.end();
    return;
  }

  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    res.status(401).json(unAuthorized);
    res.end();
    return;
  }
  const user = await dbClient.getUserById(userId);
  if (!user) {
    res.status(401).json(unAuthorized);
    res.end();
    return;
  }
  req.user = user;
  next();
};

module.exports = {
  basicAuth,
  bearerAuth,
};
