import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.PROJ_CONNECTION_STRING });
