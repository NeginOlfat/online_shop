const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone')

const User = require('../app/models/users');
const typeDefs = require('../api/schema');
const resolvers = require('../api/resolver');


module.exports = class Application {
  constructor() {
    this.ServerConfig();
    this.DatabaseConfig();
  }

  ServerConfig() {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
      formatError(err) {
        const data = err.extensions.data;
        const code = err.extensions.code || 500;
        const message = err.message || 'error';

        return { data, status: code, message }
      }
    });

    const { url } = startStandaloneServer(server, {
      listen: { port: config.port },
      context: async ({ req }) => {
        const secretId = config.secretId;
        const check = await User.CheckToken(req, secretId);
        return {
          secretId,
          check
        }
      }
    });

    console.log(`🚀  Server ready at: ${url}`);
  }

  DatabaseConfig() {
    mongoose.Promise = global.Promise;
    mongoose.set('strictQuery', true)
    mongoose.connect(config.database.url, config.database.options);
  }
} 
