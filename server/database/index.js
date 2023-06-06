const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGO_PORT)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err))