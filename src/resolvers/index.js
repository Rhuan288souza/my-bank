const { mergeResolvers } = require('@graphql-tools/merge')
const accountResolvers = require('./account')
const transactionResolvers = require('./transaction')

const resolvers = mergeResolvers([accountResolvers, transactionResolvers])

module.exports = resolvers
