const express = require('express')
const router = express.Router()

const connection = require('../config/db')
const {body, validationResult} = require('express-validator')


const authenticateToken = require('./auth/middleware/authenticateToken')
router.get('/',authenticateToken, function(req,res){
    connection.query(`SELECT * FROM love order by id desc`, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'jumlah like :',
                data: rows
            })
        }
    })
})

router.post('/store',authenticateToken,[
    body('user_id').notEmpty(),
    body('post_id').notEmpty(),
], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let Data = {
        user_id: req.body.user_id,
        post_id: req.body.post_id,
    }
    connection.query('insert into love set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'like create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function(req,res) {
    let id= req.params.id
    connection.query(`select * from love where user_id = ${id}`, function(err,rows){
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
                message:'jumlah Like :',
                data: rows
            })
        }
    })
})

router.patch('/update/:id',authenticateToken,[
    body('user_id').notEmpty(),
    body('post_id').notEmpty(),
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id
    let data = {
        user_id: req.body.user_id,
        post_id: req.body.post_id,
    }
    connection.query(`update love set ? where id = ${id}`, data, function(err,rows){
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
    connection.query(`delete from love where post_id = ${id}`, function(err, rows){
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

module.exports = router