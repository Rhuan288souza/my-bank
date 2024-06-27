const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const { ApolloServerPluginLandingPageDisabled } = require('apollo-server-core')
const bodyParser = require('koa-bodyparser')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const connectDB = require('../config/database')
const typeDefs = require('./schemas')
const resolvers = require('./resolvers')

const app = new Koa()
const PORT = process.env.PORT || 4000

connectDB()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({ 
  schema,
  plugins: [ApolloServerPluginLandingPageDisabled()],
})

async function startServer() {
  await server.start()
  server.applyMiddleware({ app })

  app.use(bodyParser())

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startServer()
