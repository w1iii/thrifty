import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  
  // Validate all required fields
  if (!username || !password || !email) {
    return res.status(400).json({ 
      error: "Please enter username, password, and email" 
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: "Please enter a valid email address" 
    });
  }

  // Username validation
  if (username.length < 3) {
    return res.status(400).json({ 
      error: "Username must be at least 3 characters long" 
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ 
      error: "Password must be at least 6 characters long" 
    });
  }
 
  try {
    // Check if username already exists
    const checkUsernameQuery = "SELECT id FROM users WHERE username = $1";
    const existingUsername = await pool.query(checkUsernameQuery, [username]);
    
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ 
        error: "Username already exists" 
      });
    }

    // Check if email already exists
    const checkEmailQuery = "SELECT id FROM users WHERE email = $1";
    const existingEmail = await pool.query(checkEmailQuery, [email]);
    
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ 
        error: "Email already registered" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with email
    const insertUserQuery = `
      INSERT INTO users (username, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, username, email, created_at;
    `;

    const newUser = await pool.query(insertUserQuery, [username, email, hashedPassword]);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
        created_at: newUser.rows[0].created_at
      }
    });

  } catch(error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      error: "Server error during signup" 
    });
  }
}

export const login = async (req, res) => {
  // Allow login with either username OR email
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({ 
      error: "Please enter username/email and password" 
    });
  }

  try {
    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    
    let searchQuery;
    let queryParams;
    
    if (isEmail) {
      searchQuery = `SELECT * FROM users WHERE email = $1`;
      queryParams = [identifier];
    } else {
      searchQuery = `SELECT * FROM users WHERE username = $1`;
      queryParams = [identifier];
    }

    const queryRes = await pool.query(searchQuery, queryParams);

    if (queryRes.rows.length === 0) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    const user = queryRes.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ 
        error: "Server configuration error" 
      });
    }
    
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Extended from 10min to 24h
    );

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    };
    
    return res.status(200).json({
      message: "Login successful",
      user: userData,
      token: token
    });
    
  } catch(error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      error: "Server error during login" 
    });
  }
}

