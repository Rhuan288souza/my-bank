const { mergeTypeDefs } = require('@graphql-tools/merge')
const accountTypeDefs = require('./account')
const transactionTypeDefs = require('./transaction')

const typeDefs = mergeTypeDefs([accountTypeDefs, transactionTypeDefs])

module.exports = typeDefs
