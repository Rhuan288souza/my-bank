const Account = require('../models/account')

const accountResolvers = {
  Query: {
    getAccount: async (_, { id }) => Account.findById(id),
    getAccounts: async () => Account.find({}),
  },
  Mutation: {
    createAccount: async (_, { name, balance }) => {
      const account = new Account({ name, balance })
      return account.save()
    },
  },
}

module.exports = accountResolvers
