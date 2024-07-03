import { MongoClient } from 'mongodb';
import mongoDBCore from 'mongodb/lib/core';

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

  async getUserByEmailAndPassword(email, password) {
    return this.client.db().collection('users').findOne({ email, password });
  }

  async getUserById(id) {
    return this.client
      .db()
      .collection('users')
      .findOne({ _id: new mongoDBCore.BSON.ObjectId(id) });
  }

  async getFileById(id) {
    return this.client
      .db()
      .collection('files')
      .findOne({ _id: new mongoDBCore.BSON.ObjectId(id) });
  }

  async addFile(data) {
    return this.client.db().collection('files').insertOne(data);
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
