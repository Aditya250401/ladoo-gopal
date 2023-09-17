//setup express
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')

//setup middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')

const port = process.env.PORT || 5000

const connectDB = require('./db/connect')

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
	res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})
app.get('/api/v1/', (req, res) => {
	console.log(req.cookies)
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)

//setup middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () => {
			console.log(`Server is running on port ${port}...`)
		})
	} catch (err) {
		console.log(err)
	}
}

start()
