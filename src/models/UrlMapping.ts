import Model from './model';

const TABLE_NAME: string = 'url_mapping';

class UrlMapping extends Model {
  constructor() {
    super(TABLE_NAME);
  }

  public async getByShortId(shortId: string) {
    try {
      const result = await this.pool.query(
        `
        select * from url_mapping where short_code=$1
        `,
        [shortId]
      );
      return result && result.rows && result.rows.length ? result.rows[0] : {};
    } catch (err) {
      console.error(err);
      throw new Error(`Error retrieving shortId ${shortId}`);
    }
  }
}

export default UrlMapping;
