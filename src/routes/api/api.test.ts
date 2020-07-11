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

describe('GET /api/mapping - test if we received array of objects of correct schema', () => {
  it('successful GET', async done => {
    const result = await request(app).get('/api/mapping');
    expect(result.status).toBe(200);
    expect(result.body).toBeTruthy();
    // seed data
    expect(result.body.length).toBeGreaterThanOrEqual(2);

    // check for non falsy keys matching our schema
    const bodyKeys = Object.keys(result.body[0]);
    const keys = ['id', 'long_url', 'short_code', 'visited', 'added', 'updated'];

    expect(bodyKeys).toEqual(keys);
    done();
  });
});

describe('POST /api/generateShortId - expect response of newly inserted record', () => {
  it('successful POST', () => {
    return request(app)
      .post('/api/generateShortId')
      .send({ originalUrl: 'https://www.youtube.com' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toBeTruthy();

        // delete fields that will change every run
        const removed = { ...response.body };
        delete removed.id;
        delete removed.added;
        delete removed.updated;
        delete removed.short_code;

        expect(removed).toEqual({ long_url: 'https://www.youtube.com', visited: 0 });
      });
  });
});
