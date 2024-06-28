const mongoose = require('mongoose')
const connectDB = require('./config/database')

const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany({})
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

beforeAll(async () => {
  await connectDB()
})

afterAll(async () => {
  await wait(3000)
  await clearDatabase()
  await mongoose.connection.close()
})
