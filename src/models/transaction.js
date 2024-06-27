const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  fromAccountId: mongoose.Schema.Types.ObjectId,
  toAccountId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Transaction', TransactionSchema)
