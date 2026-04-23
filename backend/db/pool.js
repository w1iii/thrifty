import pg from 'pg';
const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // Production (Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  // Local development
  pool = new Pool({
    user: 'wii',
    password: '101904',
    host: 'localhost',
    port: 5432,
    database: 'thrifty'
  });
}

export default pool;