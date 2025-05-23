// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const carRoutes = require('./routes/car');
const carTypeRoutes = require('./routes/carType'); 

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/car-sales')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// routes
app.use('/api/cars', carRoutes);
app.use('/api/car-types', carTypeRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
