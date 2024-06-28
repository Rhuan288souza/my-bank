const Account = require('../models/account')

const accountResolvers = {
  Query: {
    getAccount: async (_, { id }) => Account.findById(id),
    getAccounts: async () => Account.find({}),
  },
  Mutation: {
    createAccount: async (_, { name, balance }) => {
      if (balance < 0) {
        throw new Error('Initial balance must be positive')
      }
      const account = new Account({ name, balance })
      return account.save()
    },
  },
}

module.exports = accountResolvers
