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
  it('successful GET', async () => {
    // first reset seed back to 0 visited
    return request(app)
      .post('/api/test/1')
      .send({ visited: 0 })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(async response => {
        expect(response.body).toBeTruthy();

        const result = await request(app).get('/in/abcdef');
        console.log(result);

        expect(result.header.location).toBe('https://www.google.com');
      });
  });
});
