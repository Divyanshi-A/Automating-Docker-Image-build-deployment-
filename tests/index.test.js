const request = require('supertest');
const express = require('express');
const app = require('../index');

describe('Stopwatch App', () => {
  let server;

  beforeAll((done) => {
    server = express().use(app);
    server.listen(8080, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return a 200 status code for the root endpoint', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should start the stopwatch', async () => {
    const response = await request(server).get('/start');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Stopwatch started.');
  });
});
