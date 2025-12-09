import pg from 'pg';
const { Pool } = pg

const pool = Pool({
  user: 'postgres',
  password: '101904',
  host: 'localhost',
  port: 5432,
  database: 'thrifty'
});

export default pool;
