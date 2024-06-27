const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['debit', 'credit'], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ledger', LedgerSchema);
