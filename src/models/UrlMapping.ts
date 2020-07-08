import { QueryResult } from 'pg';
import * as shortid from 'shortid';
import { QueryError } from '../errors';
import { UrlMappingType } from '../types';
import Model from './model';

const TABLE_NAME: string = 'url_mapping';

class UrlMapping extends Model {
  constructor() {
    super(TABLE_NAME);
  }

  public async getAll(): Promise<UrlMappingType[]> {
    try {
      const result = await this.pool.query(
        `
        select * from url_mapping where visited < 10;
        `,
        []
      );
      return result && result.rows && result.rows.length ? result.rows : [];
    } catch (err) {
      console.error(err);
      throw new Error(`Error retrieving shortId all url mappings`);
    }
  }

  public async getByShortId(shortId: string): Promise<UrlMappingType> {
    try {
      const result = await this.pool.query(
        `
        select * from url_mapping where short_code=$1;
        `,
        [shortId]
      );
      return result && result.rows && result.rows.length ? result.rows[0] : UrlMappingType;
    } catch (err) {
      console.error(err);
      throw new Error(`Error retrieving shortId ${shortId}`);
    }
  }

  public async storeUrl(originalUrl: string): Promise<UrlMappingType> {
    try {
      const stored: QueryResult = await this.pool.query(
        `
        insert into url_mapping(long_url, short_code) values ($1,$2)
        returning *;
        `,
        [originalUrl, shortid.generate()]
      );
      return stored && stored.rows && stored.rows.length ? stored.rows[0] : UrlMappingType;
    } catch (err) {
      throw new QueryError(err, `Unable to store in DB: ${originalUrl}`);
    }
  }
}

export default UrlMapping;
