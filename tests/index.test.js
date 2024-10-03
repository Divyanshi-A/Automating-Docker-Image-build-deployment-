const request = require('supertest');
const app = require('../index');

describe('Stopwatch App', () => {
  let server;

  beforeAll(() => {
    server = app.listen(8080);
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

  it('should stop the stopwatch', async () => {
    await request(server).get('/start');
    const response = await request(server).get('/stop');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Stopwatch stopped.');
  });

  it('should reset the stopwatch', async () => {
    const response = await request(server).get('/reset');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Stopwatch reset.');
  });

  it('should return the elapsed time', async () => {
    await request(server).get('/start');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await request(server).get('/time');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch(/Elapsed time: \d+\.\d+ seconds\./);
  });
});
