import pool from '../db/pool.js';

export const getItems = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    
    const result = await pool.query(
      `
      SELECT * FROM items 
      WHERE id NOT IN (
        SELECT item_id FROM swipes WHERE user_id = $1
      )
      ORDER BY created_at DESC
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const getSavedItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `
      SELECT 
        i.id,
        i.title,
        i.description,
        i.image_url,
        i.category,
        i.price,
        s.created_at AS saved_date
      FROM items i
      JOIN swipes s ON i.id = s.item_id
      WHERE s.user_id = $1
        AND s.action = 'liked'
      ORDER BY s.created_at DESC
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load saved items" });
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

export const saveSwipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id, action } = req.body;

    // Check if swipe already exists
    const existingSwipe = await pool.query(
      `
      SELECT * FROM swipes 
      WHERE user_id = $1 AND item_id = $2
      `,
      [userId, item_id]
    );

    if (existingSwipe.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Already swiped on this item',
        status: 'duplicate'
      });
    }

    const result = await pool.query(
      `
      INSERT INTO swipes (user_id, item_id, action)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, item_id, action]
    );

    res.status(201).json({ 
      data: result.rows[0],
      status: 'success'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save swipe' });
  }
};
