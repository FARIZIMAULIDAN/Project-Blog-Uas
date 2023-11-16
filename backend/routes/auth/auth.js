const express = require('express');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const connection = require('../../config/db');

const secretKey = 'kunciRahasiaYangSama';

router.post('/register', [
    body('name').notEmpty().withMessage('Isi semua bidang'),
    body('jenis_kelamin').notEmpty().withMessage('Isi semua bidang'),
    body('alamat').notEmpty().withMessage('Isi semua bidang'),
    body('tanggal_lahir').notEmpty().withMessage('Isi semua bidang'),
    body('email').notEmpty().withMessage('Isi semua bidang'),
    body('passwd').notEmpty().withMessage('Isi semua bidang'), 
  ], (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() }); 
    }
    const { username, password } = req.body;
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
    connection.query(checkUserQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Server Error' });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
      }
      const insertUserQuery = 'INSERT INTO user (name,jenis_kelamin,alamat,tanggal_lahir,email,passwd) VALUES (?, ?)';
      connection.query(insertUserQuery, [name,jenis_kelamin,alamat,tanggal_lahir,email,password], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Server Error' });
        }
        const payload = { userId: results.insertId, username };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
        connection.query(updateTokenQuery, [token, results.insertId], (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Server Error' });
          }
          res.json({ token });
        });
      });
    });
  });

router.post('/login', (req, res) => {
    const { email, passwd } = req.body;
  
    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Server Error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Gagal masuk' });
      }
      const user = results[0];
      if (user.passwd !== passwd) {
        return res.status(401).json({ error: 'Kata sandi salah' });
      }
      if (user.token) {
        const token = user.token;
        res.json({ token });
      } else {
        const payload = { userId: user.id, username };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = 'UPDATE users SET token = ? WHERE id = ?';
        connection.query(updateTokenQuery, [token, user.id], (err, updateResult) => {
          if (err) {
            return res.status(500).json({ error: 'Server Error' });
          }
          res.json({ token });
        });
      }
    });
  });

  module.exports = router;