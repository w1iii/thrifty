import pool from '../db/pool.js';

export const getItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM items i
      WHERE NOT EXISTS (
        SELECT 1
        FROM swipes s
        WHERE s.user_id = $1
          AND s.item_id = i.id
      )
      ORDER BY i.created_at DESC
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
  const { title, description, price, category, size, gender, image_url } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO items (title, description, price, category, size, gender, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [title, description, price, category, size, gender, image_url]
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


export const sellItem = async(req,res) => {
  const { item_name, description, price, category, size, gender, image } = req.body;
  if ( !item_name, !description, !price, !category, !size, !gender, !image ) return res.status(404).json({error: "item details incomplete"});

  const query = `
    INSERT INTO items (title, description, image_url, category, price, size, gender)
    VALUES ($1, $2, %3, $4, $5, $6, $7)
    RETURNING *;
  `

  const result = await pool.query(query, [ item_name, description, price, category, size, gender, image ])
  if(!result) return console.log("add item failed")

  
}
