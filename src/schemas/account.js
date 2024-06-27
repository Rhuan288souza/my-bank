const { gql } = require('apollo-server-koa')

const accountTypeDefs = gql`
  type Account {
    id: ID!
    name: String!
    balance: Int!
  }

  type Query {
    getAccount(id: ID!): Account
    getAccounts: [Account]
  }

  type Mutation {
    createAccount(name: String!, balance: Int!): Account
  }
`

module.exports = accountTypeDefs
