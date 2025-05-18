import dotenv from 'dotenv';

// Load environment variables FIRST, before other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import feedbackRoutes from './src/api/routes/feedback.js';
import { connectDB } from './src/services/dbService.js';

// Debug to see if environment variables are loaded
console.log('MONGODB_URI available:', !!process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB()
  .then(() => {
    // Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    }));
    app.use(express.json());

    // Routes
    app.use(feedbackRoutes);

    // Default route
    app.get('/', (req, res) => {
      res.send('API is running');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Server failed to start due to database connection error:', err);
    process.exit(1);
  });