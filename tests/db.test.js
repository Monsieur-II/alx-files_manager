const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const mongoDBCore = require('mongodb/lib/core');
const DBClient = require('../utils/db');

describe('DBClient', () => {
  let clientConnectStub;
  let clientIsConnectedStub;
  let dbClient;

  beforeEach(() => {
    clientConnectStub = sinon.stub(MongoClient.prototype, 'connect');
    clientIsConnectedStub = sinon.stub(MongoClient.prototype, 'isConnected');
    dbClient = new DBClient();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getFileById', () => {
    it('should return the file with the given id', async () => {
      const fileId = 'fileId123';
      const fileData = { _id: fileId, name: 'test.txt' };
      const findOneStub = sinon.stub().resolves(fileData);
      const collectionStub = sinon.stub().returns({ findOne: findOneStub });
      const dbStub = sinon
        .stub(dbClient.client, 'db')
        .returns({ collection: collectionStub });

      const result = await dbClient.getFileById(fileId);

      expect(dbStub.calledOnce).to.be.true;
      expect(collectionStub.calledOnceWith('files')).to.be.true;
      expect(
        findOneStub.calledOnceWith({
          _id: new mongoDBCore.BSON.ObjectId(fileId),
        })
      ).to.be.true;
      expect(result).to.deep.equal(fileData);
    });
  });
});
