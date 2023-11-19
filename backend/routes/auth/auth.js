const express = require('express');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const connection = require('../../config/db');

const secretKey = 'kunciRahasiaYangSama';

router.post('/register', [
    body('nama').notEmpty().withMessage('Isi nama'),
    body('jenis_kelamin').notEmpty().withMessage('Isi jenis kelamin'),
    body('alamat').notEmpty().withMessage('Isi alamat'),
    body('tanggal_lahir').notEmpty().withMessage('Isi tanggal lahir'),
    body('email').notEmpty().withMessage('Isi email'),
    body('password').notEmpty().withMessage('Isi password'), 
  ], (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() }); 
    }
    const { nama, jenis_kelamin, alamat, tanggal_lahir, email, password } = req.body;
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
    connection.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Server Error', msg:err });
      }
      if (result.length > 0) {
        return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
      }
      const insertUserQuery = 'INSERT INTO user (nama, jenis_kelamin, alamat, tanggal_lahir, email, password) VALUES (?,?,?,?,?,?)';
      connection.query(insertUserQuery, [nama, jenis_kelamin, alamat, tanggal_lahir, email, password], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Server Error', msg: err });
        }
        const payload = { userId:result.insertId, nama };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = 'UPDATE user SET token = ? WHERE id = ?';
        connection.query(updateTokenQuery, [token, result.insertId], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Server Error' });
          }
          res.json({ token });
        });
      });
    });
  });

router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Server Error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Gagal masuk' });
      }
      const user = results[0];
      if (user.password !== password) {
        return res.status(401).json({ error: 'Kata sandi salah' });
      }
      if (user.token) {
        const token = user.token;
        res.json({ token });
      } else {
        const payload = { userId: user.id, username };
        const token = jwt.sign(payload, secretKey);
        const updateTokenQuery = 'UPDATE user SET token = ? WHERE id = ?';
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