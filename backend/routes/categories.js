const express = require('express')
const router = express.Router()
const connection = require('../config/db')
const {body, validationResult} = require('express-validator')

const authenticateToken = require('../routes/auth/middleware/authenticateToken');

router.get('/',authenticateToken,function(req,res){
    connection.query('SELECT * FROM categories ORDER BY id DESC', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data category :',
                data: rows
            })
        }
    })
})

router.post('/store',authenticateToken, [
    body('category').notEmpty(),
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        category: req.body.category,
    }
    connection.query('insert into categories set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'Create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function(req,res) {
    let id= req.params.id
    connection.query(`select * from categories where id = ${id}`, function(err,rows){
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
                message:'Data category :',
                data: rows[0]
            })
        }
    })
})

router.patch('/update/:id',authenticateToken,[
    body('category').notEmpty(),
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id
    let data = {
        category: req.body.category,
    }
    connection.query(`update categories set ? where id = ${id}`, data, function(err,rows){
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

router.delete('/delete/(:id)',authenticateToken,function(req, res){
    let id = req.params.id
    connection.query(`delete from categories where id = ${id}`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error'
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data di hapus'
            })
        }
    })
})

module.exports = router;