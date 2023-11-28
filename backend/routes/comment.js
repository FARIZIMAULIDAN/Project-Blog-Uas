const express = require('express')
const router = express.Router()

const connection = require('../config/db')
const {body, validationResult} = require('express-validator')

const authenticateToken = require('./auth/middleware/authenticateToken')

router.get('/',authenticateToken, function(req,res){
    connection.query('SELECT * FROM comment order by post_id desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data comment :',
                data: rows
            })
        }
    })
})

router.post('/store',authenticateToken, [
    body('user_id').notEmpty(),
    body('comments').notEmpty(),
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
        comments: req.body.comments,
        post_id: req.body.post_id,
    }
    connection.query('insert into comment set ? ', Data, function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error : err
            })
        } else {
            return res.status(201).json({
                status: true,
                message:'comment Create',
                data: rows[0]
            })
        }
    })
})

router.get('/(:id)', function(req,res) {
    let id= req.params.id
    connection.query(`SELECT comment.comments, user.photo, user.nama FROM comment JOIN user ON comment.user_id = user.id where post_id = ${id}`, function(err,rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server error',
                error: err,
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'data comment :',
                data: rows
            })
        }
    })
})

router.patch('/update/:id',authenticateToken,[
    body('user_id').notEmpty(),
    body('post_id').notEmpty(),
    body('comment').notEmpty(),
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
        comment: req.body.comment,
    }
    connection.query(`update comment set ? where id = ${id}`, data, function(err,rows){
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
    connection.query(`delete from comment where id = ${id}`, function(err, rows){
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