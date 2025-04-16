const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const studentRoutes = require('./routes/studentRoutes');
const organizerRoutes = require('./routes/organizerRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/organizers', organizerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
