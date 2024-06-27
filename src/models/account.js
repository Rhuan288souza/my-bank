const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  name: String,
  balance: Number,
})

module.exports = mongoose.model('Account', AccountSchema)
