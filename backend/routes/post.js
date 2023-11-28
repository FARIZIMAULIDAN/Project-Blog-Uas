const express = require('express')
const router = express.Router()
const connection = require('../config/db')
const {body, validationResult} = require('express-validator')
const fs = require('fs')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'public/images')
    },
    filename:(req,file,cb) =>{
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname))
    }   
})

const upload = multer({storage: storage})
// const fileFilter = (req,file,cb) =>{
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
//         cb(null, true);
//     }else{
//         cb(new Error('jenis file tidak diizinkan'),false);
//     }
// }

// const upload = multer({storage:storage,fileFilter:fileFilter})

const authenticateToken = require('./auth/middleware/authenticateToken')

router.get('/',authenticateToken, function(req,res){
    connection.query('SELECT post.id, user.nama, post.body, post.photos, user.photo, user_id FROM post JOIN user ON post.user_id = user.id order by post.id desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data posts :',
                data: rows
            })
        }
    })
})

router.get('/user_id',authenticateToken, function(req,res){
    connection.query('SELECT user.nama, post.body, post.photos, user.photo, user_id FROM post JOIN user ON post.user_id = user.id order by post.user_id desc', function(err, rows){
        if(err){
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            })
        } else {
            return res.status(200).json({
                status: true,
                message:'Data posts :',
                data: rows
            })
        }
    })
})

router.post('/store', upload.single("photos"), (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({
            error: error.array()
        });
    }

    let data = {
        user_id: req.body.user_id,
        body: req.body.body,
    };

    if (req.file) {
        data.photos = req.file.filename;
    }

    connection.query('INSERT INTO post SET ?', data, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'server failed',
                error: err
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Post Created',
                data: rows[0]
            });
        }
    });
});

router.get('/(:id)', function(req,res) {
    let id= req.params.id
    connection.query(`SELECT user.nama, post.body, post.photos, user.photo, user_id FROM post JOIN user ON post.user_id = user.id where user_id = ? ORDER BY post.id desc `, id, function(err,rows){
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
                message:'data post :',
                data: rows
            })
        }
    })
})

router.patch('/update/:id',authenticateToken,upload.single("photos"),[
    body('tittle').notEmpty(),
    body('user_id').notEmpty(),
    body('body').notEmpty(),
    body('slug').notEmpty(),
    body('photos').notEmpty(),
    body('category_id').notEmpty(),
    body('excerpt').notEmpty(),
], (req,res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()
        })
    }
    let id = req.params.id
    let photos = req.file ? req.file.filename:null;
    connection.query(`select * from post where id = ${id}`,function(err,rows){
        if(err){
            return res.status(500).json({
                status:false,
                message:'server error',
            })
        }if(rows.length ===0){
            return res.status(404).json({
                status:false,
                message:'not found'
            })
        }
        const namaFileLama = rows[0].photos;
        if(namaFileLama && photos){
            const pathFileLama = path.join(__dirname,'../public/images',namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
        let data = {
            tittle: req.body.tittle,
            user_id: req.body.user_id,
            body: req.body.body,
            slug: req.body.slug,
            photos: req.body.photos,
            category_id: req.body.category_id,
            excerpt: req.body.excerpt,
        }
        connection.query(`update post set ? where id = ${id}`, data, function(err,rows){
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

})

router.delete('/delete/(:id)',authenticateToken, function(req, res){
    let id = req.params.id
    connection.query(`select * from post where id = ${id}`,function(err,rows){
        if(err){
            return res.status(500).json({
                status:false,
                message:'server error'
            })
        }if(rows.length ===0){
            return  res.status(404)({
                status:false,
                message:'not found'
            })
        }
        const namaFileLama = rows[0].photos;

        if(namaFileLama){
            const pathFileLama = path.join(__dirname,'../public/images',namaFileLama);
            fs.unlinkSync(pathFileLama);
        }
        connection.query(`delete from post where id = ${id}`, function(err, rows){
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
})

module.exports = router