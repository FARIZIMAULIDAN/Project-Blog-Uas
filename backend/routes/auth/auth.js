const express = require('express');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const connection = require('../../config/db');
const multer = require('multer')
const path =  require('path');
const authenticateToken = require('./middleware/authenticateToken');
const { verify } = require('crypto');

const secretKey = 'kunciRahasiaYangSama';

const storage = multer.diskStorage({
  destination:(req,file,cb) =>{
      cb(null,'public/user')
  },
  filename:(req,file,cb) =>{
      console.log(file)
      cb(null,Date.now() + path.extname(file.originalname))
  }   
})
const upload = multer({storage:storage})

router.post('/register',upload.single("photo"),[
    body('nama').notEmpty().withMessage('Isi nama'),
    body('jenis_kelamin').notEmpty().withMessage('Isi jenis kelamin'),
    body('alamat').notEmpty().withMessage('Isi alamat'),
    body('tanggal_lahir').notEmpty().withMessage('Isi tanggal lahir'),
    body('email').notEmpty().withMessage('Isi email').isEmail(),
    body('password').notEmpty().withMessage('Isi password').isLength({ min:5 }),
  ], (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() }); 
    }
    const { nama, email } = req.body;
    // let photo = req.file.filename;
    let Data = {
      nama: req.body.nama,
      jenis_kelamin:req.body.jenis_kelamin,
      alamat:req.body.alamat,
      tanggal_lahir: req.body.tanggal_lahir,
      photo: req.file.filename,
      email: req.body.email,
      password: req.body.password,
    }
    const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
    connection.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Server Error', msg:err });
      }
      if (result.length > 0) {
        return res.status(409).json({ error: 'Pengguna sudah terdaftar' });
      }
      const insertUserQuery = 'INSERT INTO user set ?';
      connection.query(insertUserQuery, Data, (err, result) => {
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
        const statusData = { status: '1', user_id: user.id };
        connection.query('INSERT INTO status SET ?', statusData, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Server Error', msg: err });
        }
      });
        const token = user.token;
        res.json({ token });
      } else {
          const payload = { userId: user.id, email };
          const token = jwt.sign(payload, secretKey);
          const updateTokenQuery = 'UPDATE user SET token = ? WHERE id = ?';
          connection.query(updateTokenQuery, [token, user.id], (err, updateResult) => {
            if (err) {
              return res.status(500).json({ error: 'Server Error' });
            }
            res.json({ Login:true, token, updateResult });
          })
      }
    });
  });

  router.get('/(:token)', authenticateToken, function(req, res) {
    const token = req.params.token;
    // const decoded = jwt.decode(token, secretKey);
    
    // if (!decoded) {
    //   return res.status(401).json({ error: 'Not authenticated' });
    // }
    
    // const id = decoded.userId;
    const getUserQuery = 'SELECT * FROM user WHERE token = ?';

    connection.query(getUserQuery, [token], (err, results) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Server Error',
            msg: err
          });
        }
        if (results.length === 0) {
            return res.status(404).json({ 
              error: 'User not found',
              message: err 
            });
        } else {
          return res.status(200).json({
            status: true,
            message:'Data User :',
            data: results[0]
        })
        }
    });
});

  router.get('/id/(:id)', function(req, res) {
    const id = req.params.id;
    const getUserQuery = 'SELECT nama, photo, id FROM user WHERE id = ?';

    connection.query(getUserQuery, [id], (err, results) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Server Error',
            msg: err
          });
        }
        if (results.length === 0) {
            return res.status(404).json({ 
              error: 'User not found',
              message: err 
            });
        } else {
          return res.status(200).json({
            status: true,
            message:'Data User :',
            data: results[0]
        })
        }
    });
});

  module.exports = router;