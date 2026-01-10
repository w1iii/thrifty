// server.js / app.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'; // Optional but helpful
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes.js'; // Your routes
import itemRoutes from './routes/itemRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();


const PORT = process.env.PORT || 5050;

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// ⚠️ MUST HAVE THESE MIDDLEWARES:
app.use(cors(corsOptions)); // Enable CORS for all routes

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use(cookieParser());

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// routes
app.use('/api/auth', authRoutes); 
app.use('/api/items', itemRoutes);

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
