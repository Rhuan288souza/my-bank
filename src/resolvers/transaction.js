const Transaction = require('../models/transaction')
const Account = require('../models/account')
const LedgerEntry = require('../models/ledger')

const transactionResolvers = {
  Query: {
    getTransaction: async (_, { id }) => Transaction.findById(id),
    getTransactions: async () => Transaction.find({}),
    getLedgerEntries: async (_, { accountId }) => LedgerEntry.find({ accountId }),
  },
  Mutation: {
    createTransaction: async (_, { fromAccountId, toAccountId, amount }) => {
      const session = await Transaction.startSession()
      session.startTransaction()

      try {
        const fromAccount = await Account.findById(fromAccountId).session(session)
        const toAccount = await Account.findById(toAccountId).session(session)

        if (!fromAccount || !toAccount) {
          throw new Error('Account not found')
        }

        if (fromAccount.balance < amount) {
          throw new Error('Insufficient funds')
        }

        // Create transaction
        const transaction = new Transaction({
          fromAccountId,
          toAccountId,
          amount,
        })

        await transaction.save({ session })

        // Debit fromAccount
        fromAccount.balance -= amount
        await fromAccount.save({ session })

        // Credit toAccount
        toAccount.balance += amount
        await toAccount.save({ session })

        // Create ledger entries
        const debitEntry = new LedgerEntry({
          accountId: fromAccountId,
          transactionId: transaction._id,
          amount: -amount,
          type: 'debit',
        })

        const creditEntry = new LedgerEntry({
          accountId: toAccountId,
          transactionId: transaction._id,
          amount: amount,
          type: 'credit',
        })

        await debitEntry.save({ session })
        await creditEntry.save({ session })

        await session.commitTransaction()
        session.endSession()

        return transaction
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new Error(error)
      }
    },
  },
}

module.exports = transactionResolvers
