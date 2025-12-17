import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function authenticateToken(req, res, next) {
  try {
    console.log('===== AUTHENTICATE TOKEN =====');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
    
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? '✓ Exists' : '✗ Missing');
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token extracted:', token ? `✓ ${token.substring(0, 20)}...` : '✗ No token');
    
    if (!token) {
      console.log('ERROR: No token found');
      return res.status(401).json({ error: "Access token required" });
    }
    
    console.log('Verifying token with JWT_SECRET...');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('ERROR: Token verification failed');
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('===== END =====');
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      
      console.log('✓ Token verified successfully');
      console.log('User payload:', user);
      
      req.user = user; // { userId, email }
      console.log('===== END =====');
      next();
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return res.status(500).json({ error: "Server error" });
  }
}
