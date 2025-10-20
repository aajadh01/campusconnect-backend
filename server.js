require('dotenv').config();  // loads .env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // 👈 import the DB connection function

// connect to MongoDB immediately
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.json({ message: 'CampusConnect API running 🚀' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/v1/auth', authRoutes);

const testRoutes = require('./src/routes/testRoutes');
app.use('/api/v1/test', testRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/v1/admin', adminRoutes);

const resourceRoutes = require('./src/routes/resourceRoutes');
app.use('/api/v1/resources', resourceRoutes);

const eventRoutes = require('./src/routes/eventRoutes');
app.use('/api/v1/events', eventRoutes);

const lostFoundRoutes = require('./src/routes/lostFoundRoutes');
app.use('/api/v1/lostfound', lostFoundRoutes);

const communityRoutes = require('./src/routes/communityRoutes');
app.use('/api/v1/community', communityRoutes);

const wishlistRoutes = require('./src/routes/wishlistRoutes');
app.use('/api/v1/wishlist', wishlistRoutes);
