const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/UserRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

