const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth'); // Import route autentikasi
const path = require('path');

const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Middleware untuk memeriksa status login
app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
        return res.redirect('/auth/login'); // Redirect ke login jika belum login
    } else if (req.session.user && req.path === '/') {
        return res.redirect('/auth/profile'); // Redirect ke profil jika sudah login
    }
    next();
});

// Routes
app.use('/auth', authRoutes);

// Root Route: Redirect ke /auth/login atau /auth/profile berdasarkan sesi
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/auth/profile');
    } else {
        return res.redirect('/auth/login');
    }
});

// Menjalankan Server
app.listen(3000, () => {
    console.log('Server running on port 3000, open web via http://localhost:3000');
});
