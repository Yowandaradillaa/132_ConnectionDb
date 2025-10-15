const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port: '3306',
  password: '12345',
  database: 'mahasiswa'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL Successfully');
});

app.get('/', (req, res) => {
  res.send('Web Service Mahasiswa is running!');
});

app.get('/biodata', (req, res) => {
  const sql = 'SELECT * FROM biodata';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ message: 'Gagal mengambil data' });
    } else {
      res.json(results);
    }
  });
});

app.post('/biodata', (req, res) => {
  const { nama, alamat, agama } = req.body;

  if (!nama || !alamat || !agama) {
    return res.status(400).json({
      message: 'Semua field harus diisi: nama, alamat, agama'
    });
  }

  const sql = 'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)';
  db.query(sql, [nama, alamat, agama], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Gagal menambahkan data' });
    } else {
      res.status(201).json({
        message: 'Data berhasil ditambahkan',
        id: result.insertId
      });
    }
  });
});


