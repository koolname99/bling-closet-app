const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Bling Closet API is running' });
});

// API routes
app.use('/api/items', require('./routes/items'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
