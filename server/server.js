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
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

console.log(process.env.JWT_SECRET)

// routes
app.use('/api/auth', authRoutes); 
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
