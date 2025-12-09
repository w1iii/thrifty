import pg from 'pg';
const { Pool } = pg

const pool = new Pool({
  user: 'wii',
  password: '101904',
  host: 'localhost',
  port: 5432,
  database: 'thrifty'
});

export default pool;
