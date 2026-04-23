import pool from '../db/pool.js';

export const addItem = async (req, res) => {
  const { title, description, price, category, condition, imageUrl } = req.body;
  const userId = req.user.id;

  if (!title || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items (title, description, price, category, condition, image_url, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, price, category, condition, imageUrl, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};
