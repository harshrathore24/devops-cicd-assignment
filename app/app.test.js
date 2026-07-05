const request = require('supertest');
const app = require('./app');

describe('Sample DevOps App', () => {
  it('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello from Sample DevOps App!');
  });

  it('GET /health should return UP status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
  });

  it('GET /ready should return READY status', async () => {
    const res = await request(app).get('/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('READY');
  });

  it('GET /metrics should return prometheus-style text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('app_requests_total');
  });
});
