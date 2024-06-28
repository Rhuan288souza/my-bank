const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
  fromAccountId: mongoose.Schema.Types.ObjectId,
  toAccountId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  date: { type: Date, default: Date.now },
  transactionId: { type: String, required: true, unique: true },
})

module.exports = mongoose.model('Transaction', TransactionSchema)
