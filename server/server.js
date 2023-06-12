const PORT = process.env.PORT || 3000
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const MongoStore = require('connect-mongo')
const app = express()
require('dotenv').config()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

require('./strategy/spotify')

require('./database')

app.set("trust proxy", 1)

app.use(express.json())
app.use(express.urlencoded())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${process.env.MONGO_START}${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_END}`
  }),
  cookie: {
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))

app.get('/', (req, res) => { res.send('working') })

app.use(passport.initialize())
app.use(passport.session())

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))



