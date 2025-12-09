// server.js / app.js
import express from 'express';
import cors from 'cors'; // Optional but helpful
import authRoutes from './routes/authRoutes.js'; // Your routes

const app = express();
const PORT = process.env.PORT || 5050;

// ⚠️ MUST HAVE THESE MIDDLEWARES:
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Your routes
app.use('/api/auth', authRoutes); // Example: http://localhost:5000/api/auth/signup

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
