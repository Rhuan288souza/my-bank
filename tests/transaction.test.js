const request = require('supertest')
const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { v7: uuidv7 } = require('uuid')
const typeDefs = require('../src/schemas')
const resolvers = require('../src/resolvers')
const connectDB = require('../config/database')

const app = new Koa()
const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({ schema })

async function startServer() {
  await server.start()
  server.applyMiddleware({ app })
}

beforeAll(async () => {
  await connectDB()
  await startServer()
})

let fromAccountId
let toAccountId

beforeEach(async () => {
  // Create two test accounts 
  const fromAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createAccount(name: "From Account", balance: 1000) {
            id
          }
        }
      `,
    })
    .expect(200)

  const toAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createAccount(name: "To Account", balance: 500) {
            id
          }
        }
      `,
    })
    .expect(200)

  fromAccountId = fromAccountResponse.body.data.createAccount.id
  toAccountId = toAccountResponse.body.data.createAccount.id
})

test('should create a new transaction and ledger entries', async () => {
  const amount = 100
  const transactionId = uuidv7()

  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createTransaction(fromAccountId: "${fromAccountId}", toAccountId: "${toAccountId}", amount: ${amount}, transactionId: "${transactionId}") {
            id
            fromAccountId
            toAccountId
            amount
            date
            transactionId
          }
        }
      `,
    })
    .expect(200)

  expect(response.body.data.createTransaction).toHaveProperty('id')
  expect(response.body.data.createTransaction.fromAccountId).toBe(fromAccountId)
  expect(response.body.data.createTransaction.toAccountId).toBe(toAccountId)
  expect(response.body.data.createTransaction.amount).toBe(amount)
  expect(response.body.data.createTransaction.transactionId).toBe(transactionId)

  // Verify Accounts Balance
  const fromAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getAccount(id: "${fromAccountId}") {
            id
            balance
          }
        }
      `,
    })
    .expect(200)

  const toAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getAccount(id: "${toAccountId}") {
            id
            balance
          }
        }
      `,
    })
    .expect(200)

  expect(fromAccountResponse.body.data.getAccount.balance).toBe(900)
  expect(toAccountResponse.body.data.getAccount.balance).toBe(600)

  // Verify Ledger Entries
  const fromLedgerEntriesResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getLedgerEntries(accountId: "${fromAccountId}") {
            id
            accountId
            transactionId
            amount
            type
            date
          }
        }
      `,
    })
    .expect(200)

  const toLedgerEntriesResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getLedgerEntries(accountId: "${toAccountId}") {
            id
            accountId
            transactionId
            amount
            type
            date
          }
        }
      `,
    })
    .expect(200)

  expect(fromLedgerEntriesResponse.body.data.getLedgerEntries.length).toBeGreaterThan(0)
  expect(toLedgerEntriesResponse.body.data.getLedgerEntries.length).toBeGreaterThan(0)
})

test('should return the existing transaction for duplicate transactionId', async () => {
  const amount = 100
  const transactionId = uuidv7()

  // Create the first transaction
  const firstResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createTransaction(fromAccountId: "${fromAccountId}", toAccountId: "${toAccountId}", amount: ${amount}, transactionId: "${transactionId}") {
            id
            fromAccountId
            toAccountId
            amount
            date
            transactionId
          }
        }
      `,
    })
    .expect(200)
    
  expect(firstResponse.body.data.createTransaction).toBeTruthy()

  // Try to create a second transaction with the same transactionId
  const secondResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createTransaction(fromAccountId: "${fromAccountId}", toAccountId: "${toAccountId}", amount: ${amount}, transactionId: "${transactionId}") {
            id
            fromAccountId
            toAccountId
            amount
            date
            transactionId
          }
        }
      `,
    })
    .expect(200)

  expect(secondResponse.body.data.createTransaction).toBeTruthy()
  expect(secondResponse.body.data.createTransaction.id).toBe(firstResponse.body.data.createTransaction.id)
  expect(secondResponse.body.data.createTransaction.transactionId).toBe(transactionId)

  // Verify that no additional changes were made to the accounts
  const fromAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getAccount(id: "${fromAccountId}") {
            id
            balance
          }
        }
      `,
    })
    .expect(200)

  const toAccountResponse = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getAccount(id: "${toAccountId}") {
            id
            balance
          }
        }
      `,
    })
    .expect(200)

  expect(fromAccountResponse.body.data.getAccount.balance).toBe(900)
  expect(toAccountResponse.body.data.getAccount.balance).toBe(600)
})

test('should not allow creating a transaction with a negative amount', async () => {
  const amount = -100
  const transactionId = uuidv7()

  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createTransaction(fromAccountId: "${fromAccountId}", toAccountId: "${toAccountId}", amount: ${amount}, transactionId: "${transactionId}") {
            id
            fromAccountId
            toAccountId
            amount
            date
            transactionId
          }
        }
      `,
    })

  expect(response.status).toBe(200)
  expect(response.body.errors).toBeDefined()
  expect(response.body.errors[0].message).toBe('Transaction amount must be positive')
})