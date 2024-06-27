
# Woovi Bank API

This project is a simple bank API implemented using Node.js, Koa, MongoDB, and GraphQL. The API allows for transactions between accounts, balance inquiries, and ledger entries.

## Technologies Used

- **Node.js**: JavaScript runtime environment on the server side.
- **Koa**: Minimalist framework for Node.js.
- **MongoDB**: NoSQL document-oriented database.
- **GraphQL**: Query language for APIs.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **Apollo Server**: GraphQL server for Node.js.
- **graphql-http**: Middleware to integrate GraphQL with Koa.
- **Jest**: JavaScript testing framework.
- **Supertest**: Library for testing HTTP APIs.
- **Nodemon**: Tool for automatically restarting Node.js server during development.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Rhuan288souza/my-bank.git
   cd my-bank
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure environment variables:
   
   Create a `.env` file at the root of the project and add the following environment variables:

   ```env
   MONGO_HOST=your-mongo-host
   MONGO_DB=your-database-name
   MONGO_USER=your-username
   MONGO_PASSWORD=your-password
   PORT=4000
   ```

## Usage

### Development

To start the server in development mode with hot-reload using Nodemon:

```bash
yarn start:dev
```

### Production

To start the server in production mode:

```bash
yarn start
```

### Testing

To run the tests:

```bash
yarn test
```

## API

The API is publicly available on Heroku:

[https://woovi-bank-895079575c08.herokuapp.com/graphql](https://woovi-bank-895079575c08.herokuapp.com/graphql)

### Example Queries and Mutations

#### Create Account

```graphql
mutation {
  createAccount(name: "John Doe", balance: 1000) {
    id
    name
    balance
  }
}
```

#### Get Accounts

```graphql
query {
  getAccounts {
    id
    name
    balance
  }
}
```

#### Create Transaction

```graphql
mutation {
  createTransaction(fromAccountId: "ACCOUNT_ID_1", toAccountId: "ACCOUNT_ID_2", amount: 100) {
    id
    fromAccountId
    toAccountId
    amount
    date
  }
}
```

#### Get Transactions

```graphql
query {
  getTransactions {
    id
    fromAccountId
    toAccountId
    amount
    date
  }
}
```

### Project Structure

- **config**: Contains the database configuration.
  - `database.js`: Configuration and connection to MongoDB.
- **src**: Contains the application source code.
  - **schemas**: Contains GraphQL types and definitions.
    - `index.js`: Combines the schemas.
    - `account.js`: Schema for accounts.
    - `transaction.js`: Schema for transactions.
    - `ledger.js`: Schema for the ledger.
  - **resolvers**: Contains GraphQL resolvers.
    - `index.js`: Combines the resolvers.
    - `account.js`: Resolvers for accounts.
    - `transaction.js`: Resolvers for transactions.
  - **models**: Contains Mongoose models.
    - `account.js`: Account model.
    - `transaction.js`: Transaction model.
    - `ledgerEntry.js`: Ledger entry model.
  - `server.js`: Application entry point.

## Postman Collection

To facilitate testing and interacting with the API, a Postman collection and environment file are provided.

### Importing the Postman Collection

1. Open Postman.
2. Click on the `Import` button in the top left corner.
3. Select the `File` tab.
4. Click on `Choose Files` and select the `postman-woovi.json` file from the root of this project.
5. Click on `Import`.

You will now have access to the predefined requests for the Woovi Bank API, which includes various queries and mutations to interact with the API endpoints.

### Using an Environment in Postman

1. In Postman, click on the `Environments` button (gear icon) in the top right corner.
2. Click on `Import`.
3. Select the `postman-woovi-environment.json` file from the root of this project.
4. Click on `Import`.

To use the environment:

1. In Postman, ensure the `Woovi Bank API Environment` is selected in the environment dropdown menu in the top right corner.
2. The requests in the collection will use the `baseUrl`, `fromAccountId`, and `toAccountId` variables defined in the environment.

Make sure to set the values for `fromAccountId` and `toAccountId` variables in the environment after creating the accounts using the `Create Account` request.


### Contribution

Feel free to open issues and pull requests. For larger contributions, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License. See the `LICENSE` file for more details.