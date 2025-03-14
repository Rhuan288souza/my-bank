const { gql } = require('apollo-server-koa')

const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    fromAccountId: ID!
    toAccountId: ID!
    amount: Int!
    date: String!
    transactionId: String!
  }

  type Query {
    getTransaction(id: ID!): Transaction
    getTransactions: [Transaction]
  }

  type Mutation {
    createTransaction(fromAccountId: ID!, toAccountId: ID!, amount: Int!, transactionId: String!): Transaction
  }
`

module.exports = transactionTypeDefs
