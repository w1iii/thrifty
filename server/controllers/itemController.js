 import pool from '../db/pool.js';

export const getItems = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM items ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const createItem = async (req, res) => {
  const { title, price, size, gender, image_url } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO items (title, price, size, gender, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [title, price, size, gender, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
};


