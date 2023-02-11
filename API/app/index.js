const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone')

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
    });

    const { url } = startStandaloneServer(server, {
      listen: { port: config.port },
    });

    console.log(`🚀  Server ready at: ${url}`);
  }

  DatabaseConfig() {
    mongoose.Promise = global.Promise;
    mongoose.set('strictQuery', true)
    mongoose.connect(config.database.url, config.database.options);
  }
} 
