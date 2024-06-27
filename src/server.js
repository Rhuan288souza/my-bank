const Koa = require('koa')
const { ApolloServer } = require('apollo-server-koa')
const bodyParser = require('koa-bodyparser')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const connectDB = require('../config/database')
const typeDefs = require('./schemas')
const resolvers = require('./resolvers')

const app = new Koa()
const PORT = process.env.PORT || 4000

connectDB()

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({}),
  ]
})

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.use(bodyParser())

  // Verify routes
  app.use(async (ctx, next) => {
    if (ctx.path === '/graphql' || ctx.path === '/') {
      await next();
    } else {
      ctx.status = 404;
      ctx.body = 'Not Found'
    }
  })

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startServer()
