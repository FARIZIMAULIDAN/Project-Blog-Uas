const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())
const path = require('path')
app.use('/static',express.static(path.join(__dirname,'public/')))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const categoriesRoutes = require('./routes/categories.js')
app.use('/api/categories', categoriesRoutes)

const users = require('./routes/auth/auth.js')
app.use('/api/auth/user', users)

const contactRoutes = require('./routes/contact')
app.use('/api/contact', contactRoutes)

const commentRoutes = require('./routes/comment')
app.use('/api/comment', commentRoutes)

const favoriteRoutes = require('./routes/favorite')
app.use('/api/favorite', favoriteRoutes)

const likeRoutes = require('./routes/like.js')
app.use('/api/like', likeRoutes)

const postRoutes = require('./routes/post')
app.use('/api/post', postRoutes)

const userRoutes = require('./routes/user')
app.use('/api/user', userRoutes)

app.listen(port,() => {
    console.log(`http://localhost:${port}`)
})