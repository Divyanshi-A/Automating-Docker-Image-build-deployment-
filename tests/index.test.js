const request = require('supertest');
const app = require('../index');

describe('Stopwatch App', () => {
  it('should return a 200 status code for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should start the stopwatch', async () => {
    const response = await request(app).get('/start');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Stopwatch started.');
  });
});
