import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const dbName = process.env.DB_DATABASE || 'files_manager';
const uri = `mongodb://${host}:${port}/${dbName}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(uri, {
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  async addUser(email, password) {
    return this.client.db().collection('users').insertOne({ email, password });
  }

  async getExistingUser(email) {
    return this.client.db().collection('users').findOne({ email });
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
