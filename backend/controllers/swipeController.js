import pool from '../db/pool.js';

export const getItems = async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM items i
       WHERE (i.owner_id != $1 OR i.owner_id IS NULL)
       AND i.id NOT IN (
         SELECT item_id FROM swipes WHERE user_id = $1
       )`,
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT i.* FROM items i
       WHERE (i.owner_id != $1 OR i.owner_id IS NULL)
       AND i.id NOT IN (
         SELECT item_id FROM swipes WHERE user_id = $1
       )
       ORDER BY RANDOM()
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const swipeItem = async (req, res) => {
  const { itemId, action } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO swipes (user_id, item_id, action)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, item_id)
       DO UPDATE SET action = $3`,
      [userId, itemId, action]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record swipe' });
  }
};

export const getSavedItems = async (req, res) => {
  const userId = req.user.id;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const offset = (page - 1) * limit;

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM items i
       JOIN swipes s ON i.id = s.item_id
       WHERE s.user_id = $1 AND s.action = 'liked'`,
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT i.*, s.created_at as saved_at
       FROM items i
       JOIN swipes s ON i.id = s.item_id
       WHERE s.user_id = $1 AND s.action = 'liked'
       ORDER BY s.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved items' });
  }
};
