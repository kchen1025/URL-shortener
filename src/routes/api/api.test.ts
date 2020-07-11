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
  it('Hello API Request', async done => {
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
