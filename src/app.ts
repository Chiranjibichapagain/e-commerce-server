import express from 'express'
import compression from 'compression'
import session from 'express-session'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongo from 'connect-mongo'
import flash from 'express-flash'
import path from 'path'
import mongoose from 'mongoose'
import passport from 'passport'
import bluebird from 'bluebird'
import cors from 'cors'
// import cookieSession from 'cookie-session'

import { MONGODB_URI, SESSION_SECRET } from './util/secrets'

import userRouter from './routers/user'
import productRouter from './routers/product'
import loginRouter from './routers/login'
import googleLoginRouter from './routers/googleLogin'
import passwordRouter from './routers/passwordHandle'
import checkoutRouter from './routers/checkout'
require('./config/passport')

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

const app = express()
const mongoUrl = MONGODB_URI

// Connect MongoDB---
mongoose.Promise = bluebird
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongo DB connected successfully!!')
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })

// Express configuration
app.set('port', process.env.PORT || 3001)

// Use common 3rd-party middlewares
app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// passport initialization and session
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/login', loginRouter)
app.use('/auth', googleLoginRouter)
app.use('/api/password', passwordRouter)
app.use('/api/checkout', checkoutRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
