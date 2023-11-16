const express = require('express')
const router = express.Router()

const connection = require('../config/db')
const {body, validationResult} = require('express-validator')


const authenticateToken = require('./auth/middleware/authenticateToken')

router.get('/',authenticateToken,function(req,res){
    connection.query('SELECT * FROM contact order by id desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Pesan User :',
                data: rows
            })
        }
    })
})

router.post('/store', authenticateToken,[
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('body').notEmpty(),
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        name: req.body.name,
        email: req.body.email,
        body: req.body.body,
    }
    connection.query('insert into contact set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'contact create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function(req,res) {
    let id= req.params.id
    connection.query(`select * from contact where id = ${id}`, function(err,rows){
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
                message:'data Alat :',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id',authenticateToken,[
    body('name').notEmpty(),
    body('email').notEmpty(),
    body('body').notEmpty(),
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
        email: req.body.email,
        body: req.body.body,
    }
    connection.query(`update contact set ? where id = ${id}`, data, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'update',
                data:rows[0]
            })
        }
    })
})

router.delete('/delete/(:id)',authenticateToken, function(req, res){
    let id = req.params.id
    connection.query(`delete from contact where id = ${id}`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data deleted'
            })
        }
    })
})

module.exports = router