import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// ========== TOKEN GENERATORS ==========
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  const { email, password, first_name, last_name, phone_number, city, state } = req.body;

  if (!password || !email) {
    return res.status(400).json({ error: "Please enter username, password, and email" });
  }

  try {

    const existingEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);


    const insertUserQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone_number, city, state)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, first_name, last_name;
      `;

    const newUser = await pool.query(insertUserQuery, [email, password_hash, first_name, last_name, phone_number, city, state]);

    res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Server error during signup" });
  }
};

// ========== LOGIN ==========
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const userRes = await pool.query(query, [email]);

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = userRes.rows[0];
    console.log("DB USER:", user);

    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      token: accessToken,
      user: {
        id: user.id,
        username: user.first_name,
        email: user.email,
        phone_number: user.phone_number,
        location: user.city
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
};

// ========== LOGOUT ==========
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

// ========== REFRESH TOKEN ==========
export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Fetch from PostgreSQL
    const userRes = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = userRes.rows[0];
    if (!user) return res.status(403);

    const newAccessToken = generateAccessToken(user);
    return res.json({ accessToken: newAccessToken });
  });
};


export const getData = async (req,res) => {
  const userId = req.user.id;

  const dataQuery = `
    SELECT id, first_name, email, phone_number, city, state FROM users WHERE id = $1;  
  `;
  try{
    const result = await pool.query(dataQuery, [userId]);

    if(result.rows.length <= 0) return res.status(404).json({ error: 'user not found'});
    // res.json(result.rows[0]);

    const user = result.rows[0];
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.first_name,
        email: user.email,
        phone_number: user.phone_number,
        city: user.city,
        state: user.state
      }
    });
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
}


export const changePassword = async (req, res) => {
  try {
    console.log('===== CHANGE PASSWORD REQUEST =====');
    console.log('User from token:', req.user);
    console.log('Body received:', req.body);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user?.userId || req.user?.id;

    // Check if user ID exists
    if (!userId) {
      console.log('ERROR: No user ID found in request');
      return res.status(401).json({ 
        message: 'Unauthorized - No user ID in token' 
      });
    }

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log('ERROR: Missing password fields');
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    if (newPassword !== confirmPassword) {
      console.log('ERROR: Passwords do not match');
      return res.status(400).json({ 
        message: 'New passwords do not match' 
      });
    }

    if (newPassword.length < 6) {
      console.log('ERROR: Password too short');
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters' 
      });
    }

    // Fetch user from database
    console.log('Fetching user with ID:', userId);
    const query = `SELECT * FROM users WHERE id = $1`;
    const userResult = await pool.query(query, [userId]);

    console.log('User found:', userResult.rows.length > 0 ? 'YES' : 'NO');

    if (userResult.rows.length === 0) {
      console.log('ERROR: User not found');
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    const user = userResult.rows[0];
    console.log('User email:', user.email);
    console.log('User password_hash exists:', user.password_hash ? 'YES' : 'NO');

    // Check if user has a password set
    if (!user.password_hash) {
      console.log('ERROR: User has no password set');
      return res.status(400).json({ 
        message: 'User account not properly configured. Please contact support.' 
      });
    }

    // Verify current password
    console.log('Verifying current password...');
    let isPasswordValid = false;
    
    try {
      isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    } catch (bcryptError) {
      console.log('ERROR: Bcrypt comparison failed -', bcryptError.message);
      return res.status(400).json({ 
        message: 'Invalid password format. Please try again.' 
      });
    }

    if (!isPasswordValid) {
      console.log('ERROR: Current password is incorrect');
      return res.status(401).json({ 
        message: 'Current password is incorrect' 
      });
    }

    console.log('Current password verified ✓');

    // Check if new password is same as current password
    let isSamePassword = false;
    
    try {
      isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    } catch (bcryptError) {
      console.log('ERROR: Bcrypt comparison failed -', bcryptError.message);
    }

    if (isSamePassword) {
      console.log('ERROR: New password is same as current');
      return res.status(400).json({ 
        message: 'New password must be different from current password' 
      });
    }

    // Hash new password
    console.log('Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    console.log('Updating password in database...');
    const updateQuery = `
      UPDATE users 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name
    `;
    const updateResult = await pool.query(updateQuery, [hashedPassword, userId]);

    console.log('Update successful:', updateResult.rows.length > 0 ? 'YES' : 'NO');

    if (updateResult.rows.length === 0) {
      console.log('ERROR: Failed to update password');
      return res.status(500).json({ 
        message: 'Failed to update password' 
      });
    }

    console.log('Password changed successfully for user:', updateResult.rows[0].email);
    console.log('===== END =====');

    return res.status(200).json({ 
      message: 'Password changed successfully',
      user: updateResult.rows[0]
    });

  } catch (error) {
    console.error('===== ERROR IN CHANGE PASSWORD =====');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('===== END ERROR =====');

    return res.status(500).json({ 
      message: 'Server error. Please try again later.',
      error: error.message
    });
  }
};
