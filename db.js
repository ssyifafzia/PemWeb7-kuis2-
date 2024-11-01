const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kelautan' // Pastikan database ini sudah ada
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected...');
});

module.exports = db; // Mengekspor koneksi database untuk digunakan di auth.js
