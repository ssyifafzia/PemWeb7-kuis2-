const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Pastikan Anda sudah memiliki konfigurasi koneksi database
const router = express.Router();

// Render halaman registrasi
router.get('/register', (req, res) => {
    res.render('register');
});

// Proses registrasi pengguna
router.post('/register', (req, res) => {
    const { Username, Email, Phone, Instagram, Password } = req.body;

    const hashedPassword = bcrypt.hashSync(Password, 10); // Menghash password

    const query = "INSERT INTO users (Username, Email, Phone, Instagram, Password) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [Username, Email, Phone, Instagram, hashedPassword], (err, result) => {
        if (err) {
            console.error("Terjadi kesalahan saat mendaftar:", err);
            return res.status(500).send("Gagal mendaftar");
        }
        res.redirect('/auth/login'); // Redirect ke halaman login setelah berhasil registrasi
    });
});

// Render halaman login
router.get('/login', (req, res) => {
    res.render('login');
});

// Proses login pengguna
router.post('/login', (req, res) => {
    const { Username, Password } = req.body;
    const query = "SELECT * FROM users WHERE Username = ?";
    db.query(query, [Username], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const user = result[0];
            // Memeriksa password yang dimasukkan dengan password yang dihash
            if (bcrypt.compareSync(Password, user.Password)) {
                req.session.user = user; // Menyimpan data pengguna dalam sesi
                res.redirect('/auth/profile'); // Redirect ke halaman profil
            } else {
                res.send('Password salah');
            }
        } else {
            res.send('Pengguna tidak ditemukan');
        }
    });
});

// Render halaman profil pengguna
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user }); // Menampilkan data pengguna yang sedang login
    } else {
        res.redirect('/auth/login'); // Redirect ke halaman login jika belum login
    }
});

// Proses logout
router.get('/logout', (req, res) => {
    req.session.destroy(); // Menghapus sesi pengguna
    res.redirect('/auth/login'); // Redirect ke halaman login setelah logout
});

module.exports = router; // Mengekspor router untuk digunakan di app.js
