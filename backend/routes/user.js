const express = require('express')
const router = express.Router()

const connection = require('../config/db')
const {body, validationResult} = require('express-validator')

const authenticateToken = require('./auth/middleware/authenticateToken')

router.get('/', authenticateToken, function(req,res){
    connection.query('SELECT * FROM user LIMIT 1', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err,
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data User :',
                data: rows
            })
        }
    })
})

router.post('/store',authenticateToken, [
    body('name').notEmpty(),
    body('jenis_kelamin').notEmpty(),
    body('alamat').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('email').notEmpty(),
    body('password').notEmpty(),
    ], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        nama: req.body.nama,
        jenis_kelamin: req.body.jenis_kelamin,
        alamat: req.body.alamat,
        tanggal_lahir: req.body.tanggal_lahir,
        email: req.body.email,
        password: req.body.password,
    }
    connection.query('insert into user set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:token)', authenticateToken, function(req,res) {
    let token = req.params.token;
    connection.query("SELECT * FROM user where token = ?", token, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err,
            })
        }
        if(rows.length <=0){
            return res.status(404).json({
                status: false,
                message: 'Not Found',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'data User : ',
                data: rows[0]
            })
        }
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
  
    connection.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Server Error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Gagal masuk' });
      }
    });
  });

router.patch('/update/:id',authenticateToken,[
    body('name').notEmpty(),
    body('jenis_kelamin').notEmpty(),
    body('alamat').notEmpty(),
    body('tanggal_lahir').notEmpty(),
    body('email').notEmpty(),
    body('password').notEmpty(),
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id
    let data = {
        name: req.body.name,
        jenis_kelamin: req.body.jenis_kelamin,
        alamat: req.body.alamat,
        tanggal_lahir: req.body.tanggal_lahir,
        email: req.body.email,
        password: req.body.password,
    }
    connection.query(`update user set ? where id = ${id}`, data, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'update'
            })
        }
    })
})

router.delete('/delete/(:id)',authenticateToken, function(req, res){
    let id = req.params.id
    connection.query(`delete from user where id = ${id}`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data di hapus'
            })
        }
    })
})

module.exports = router