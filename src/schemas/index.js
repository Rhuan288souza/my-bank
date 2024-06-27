const { mergeTypeDefs } = require('@graphql-tools/merge')
const accountTypeDefs = require('./account')
const transactionTypeDefs = require('./transaction')
const ledgerTypeDefs = require('./ledger')

const typeDefs = mergeTypeDefs([accountTypeDefs, transactionTypeDefs, ledgerTypeDefs])

module.exports = typeDefs
