const PORT = 3000
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const MongoStore = require('connect-mongo')
const app = express()
require('dotenv').config()
app.use(cors({ origin: true }))

require('./strategy/spotify')

const authRoutes = require('./routes/auth')

require('./database')

app.use(express.json())
app.use(express.urlencoded())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_PORT
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))



