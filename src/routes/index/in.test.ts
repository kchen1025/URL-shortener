import * as request from 'supertest';
import { pool } from '../../models/pool';
import { app } from '../../server';

beforeAll(done => {
  done();
});

afterAll(done => {
  // drain the pool
  pool.end();
  done();
});

describe('GET /:shortId - GET short url', () => {
  it('successful redirect', async () => {
    // first reset seed back to 0 visited
    return request(app)
      .post('/api/test/1')
      .send({ visited: 0 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async response => {
        expect(response.body).toBeTruthy();
        expect(response.body.visited).toBe(0);

        const result = await request(app).get('/in/123456');
        expect(result.header.location).toBe('https://www.amazon.com');

        // check for updated visited count
        const result2 = await request(app).get('/api/mapping/1');
        expect(result2.body.long_url).toBe('https://www.amazon.com');
        expect(result2.body.visited).toBe(1);
      });
  });

  it('unsuccessful redirect - visited 10 times', async () => {
    // first reset seed back to 0 visited
    return request(app)
      .post('/api/test/1')
      .send({ visited: 10 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async response => {
        expect(response.text.length).toBeTruthy();
        expect(response.body.visited).toBe(10);

        const result = await request(app).get('/in/123456');
        expect(result.text).toBe('Link has been used 10 times, no longer valid');
      });
  });
});
