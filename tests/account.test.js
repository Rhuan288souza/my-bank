const request = require('supertest')
const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { makeExecutableSchema } = require('@graphql-tools/schema')
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

const testAccount = {
  name: 'Test Account',
  balance: 1000,
}

test('should create a new account', async () => {
  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createAccount(name: "${testAccount.name}", balance: ${testAccount.balance}) {
            id
            name
            balance
          }
        }
      `,
    })
    .expect(200)

  expect(response.body.data.createAccount).toHaveProperty('id')
  expect(response.body.data.createAccount.name).toBe(testAccount.name)
  expect(response.body.data.createAccount.balance).toBe(testAccount.balance)
})

test('should get all accounts', async () => {
  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        query {
          getAccounts {
            id
            name
            balance
          }
        }
      `,
    })
    .expect(200)

  expect(response.body.data.getAccounts.length).toBeGreaterThan(0)
})

test('should not allow creating an account with a negative initial balance', async () => {
  const response = await request(app.callback())
    .post('/graphql')
    .send({
      query: `
        mutation {
          createAccount(name: "Invalid Account", balance: -100) {
            id
            name
            balance
          }
        }
      `
    })
    .expect(200)

  expect(response.body.errors).toBeDefined()
  expect(response.body.errors[0].message).toBe('Initial balance must be positive')
})
