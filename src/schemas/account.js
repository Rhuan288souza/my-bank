const { gql } = require('apollo-server-koa')

const accountTypeDefs = gql`
  type Account {
    id: ID!
    name: String!
    balance: Float!
  }

  type Query {
    getAccount(id: ID!): Account
    getAccounts: [Account]
  }

  type Mutation {
    createAccount(name: String!, balance: Float!): Account
  }
`

module.exports = accountTypeDefs
