const { gql } = require('apollo-server-koa');

const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    fromAccountId: ID!
    toAccountId: ID!
    amount: Float!
    date: String!
  }

  type Ledger {
    id: ID!
    accountId: ID!
    transactionId: ID!
    amount: Float!
    type: String!
    date: String!
  }

  type Query {
    getTransaction(id: ID!): Transaction
    getTransactions: [Transaction]
    getLedgerEntries(accountId: ID!): [Ledger]
  }

  type Mutation {
    createTransaction(fromAccountId: ID!, toAccountId: ID!, amount: Float!): Transaction
  }
`;

module.exports = transactionTypeDefs;
