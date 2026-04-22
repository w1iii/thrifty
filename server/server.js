// server.js / app.js
import express from 'express';
import cors from 'cors'; // Optional but helpful
import bodyParser from 'body-parser'
import authRoutes from './routes/authRoutes.js'; // Your routes
import swipeRoutes from './routes/swipeRoutes.js';
import cookieParser from 'cookie-parser';
import http from 'http';

const app = express();


const PORT = process.env.PORT || 5050;

const corsOptions = {
  origin: ['http://localhost:5173', 'https://thrifty-bice.vercel.app'],
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


// Your routes
app.use('/api/auth', authRoutes); // Example: http://localhost:5000/api/auth/signup
app.use('/api/swipe', swipeRoutes);

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
