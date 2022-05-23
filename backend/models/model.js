const mongoose = require('mongoose')

//Connect to mongodb
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Schema for replas
const replaSchema = new mongoose.Schema({
  author: String,
  repla: String,
  date: Date
})

//Schema for trips
const tripSchema = new mongoose.Schema({
  author: String,
  name: String,
  date: Date
})


const Repla = mongoose.model('Repla', replaSchema)
const Trip = mongoose.model('Trip', tripSchema)

module.exports = { Repla, Trip }
