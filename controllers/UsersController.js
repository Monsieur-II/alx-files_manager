const dbClient = require('../utils/db');
const { generateHash } = require('../utils/helpers');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }
    if (await dbClient.getExistingUser(email)) {
      res.status(400).json({ error: 'Already exist' });
      res.end();
      return;
    }
    const hash = generateHash(password);
    const user = await dbClient.addUser(email, hash);
    const id = `${user.insertedId}`;
    res.status(201).json({ id, email });
    res.end();
  }
}

module.exports = UsersController;
