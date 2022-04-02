import { Pool } from 'pg';
import config from '../config';

// connect to database
const pool = new Pool({
  host: config.host,
  port: config.dbPort as unknown as number,
  database: config.database,
  user: config.user,
  password: config.password,
});

pool.on('error', (error: Error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
});

export default pool;
