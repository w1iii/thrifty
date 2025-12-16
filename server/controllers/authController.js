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
        email: user.email
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

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Fetch from PostgreSQL
    const userRes = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = userRes.rows[0];
    if (!user) return res.sendStatus(403);

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

