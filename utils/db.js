import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const dbName = process.env.DB_DATABASE || 'files_manager';
const uri = `mongodb://${host}:${port}/${dbName}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db(dbName).collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db(dbName).collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
