import { Pool, PoolClient } from 'pg';
import { pool } from './pool';

class Model {
  public pool: Pool;
  public table: string;

  constructor(table: string) {
    this.pool = pool;
    this.table = table;
    this.pool.on('error', (err: Error, client: PoolClient) => `Error, ${err}, on idle client${client}`);
  }

  public async queryPromise(query: string, values?: any[]) {
    return this.pool.query(query, values);
  }

  public async select(columns: string, clause?: string) {
    let query = `SELECT ${columns} FROM ${this.table}`;
    if (clause) {
      query += clause;
    }
    return this.pool.query(query);
  }
}

export default Model;
