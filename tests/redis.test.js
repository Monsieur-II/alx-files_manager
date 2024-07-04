const { expect } = require('chai');
const sinon = require('sinon');
const { createClient } = require('redis');
const RedisClient = require('../utils/redis');

describe('RedisClient', () => {
  let createClientStub;
  let clientOnStub;

  beforeEach(() => {
    createClientStub = sinon.stub(createClient);
    clientOnStub = sinon.stub();
    createClientStub.returns({
      on: clientOnStub,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a Redis client and set isConnected to true on connect event', () => {
    const redisClient = new RedisClient();

    expect(createClientStub.calledOnce).to.be.true;
    expect(clientOnStub.calledOnceWith('connect')).to.be.true;
    expect(redisClient.isConnected).to.be.true;
  });

  it('should log an error message and set isConnected to false on error event', () => {
    const errorMessage = 'Redis connection error';
    const consoleLogStub = sinon.stub(console, 'log');
    const redisClient = new RedisClient();

    clientOnStub.withArgs('error').callArgWith(1, new Error(errorMessage));

    expect(createClientStub.calledOnce).to.be.true;
    expect(clientOnStub.calledOnceWith('error')).to.be.true;
    expect(
      consoleLogStub.calledOnceWith(
        `Redis client not connected to the server: ${errorMessage}`
      )
    ).to.be.true;
    expect(redisClient.isConnected).to.be.false;
  });
});
