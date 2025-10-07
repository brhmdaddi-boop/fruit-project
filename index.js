const path = require('path'); // ✅ هذا السطر ضروري
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');
const uploadRoutes = require('./routes/uploadRoutes.js');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// ✅ هذا هو "تصريح الدخول" الذي يجعل مجلد الصور عامًا
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Database Connection
const dbURI = "const dbURI = process.env.DB_URI;";

mongoose.connect(dbURI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(port, () => {
            console.log(`Server is running now at http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });