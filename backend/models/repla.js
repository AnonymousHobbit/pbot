const mongoose = require('mongoose')

//Connect to mongodb
mongoose.connect(process.env.REPLADB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Create the schema for url
const urlSchema = new mongoose.Schema({
  author: String,
  repla: String,
  date: Date
})

module.exports = mongoose.model('Line', urlSchema)
