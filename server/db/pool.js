import pg from 'pg';
const { Pool } = pg;

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'exists' : 'MISSING!');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;
