const { gql } = require('apollo-server-koa')

const ledgerTypeDefs = gql`
  type Ledger {
    id: ID!
    accountId: ID!
    transactionId: ID!
    amount: Int!
    type: String!
    date: String!
  }

  type Query {
    getLedgerEntries(accountId: ID!): [Ledger]
  }
`

module.exports = ledgerTypeDefs
