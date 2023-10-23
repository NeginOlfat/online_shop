const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground')

const User = require('../app/models/users');
const typeDefs = require('../api/schema');
const resolvers = require('../api/resolver');


module.exports = class Application {
  constructor() {
    this.ServerConfig();
    this.DatabaseConfig();
  }

  async ServerConfig() {
    const { default: graphqlUploadExpress } = await import('graphql-upload/graphqlUploadExpress.mjs');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      uploads: false,
      playground: true,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      formatError(err) {
        const data = err.extensions.data;
        const code = err.extensions.code || 500;
        const message = err.message || 'error';
        console.error(err);
        return { data, status: code, message }
      }
    })

    const { url } = startStandaloneServer(server, {
      listen: { port: config.port },
      context: async ({ req }) => {
        const secretId = config.secretId;
        const check = await User.CheckToken(req, secretId);
        let isAdmin = false;
        console.log(check)
        let info;
        if (check) {
          isAdmin = await User.findById(check.id);
          info = await User.CheckUserInfo(isAdmin)
        }

        return {
          isAdmin: isAdmin,
          secretId,
          info,
          check
        }
      },
      middleware: [
        graphqlUploadExpress({ maxFileSize: 10000, maxFiles: 10 }),
        // cors(),
        // bodyParser.json()
      ]
    });

    console.log(`🚀  Server ready at: ${url}`);
  }

  DatabaseConfig() {
    mongoose.Promise = global.Promise;
    mongoose.set('strictQuery', true)
    mongoose.connect(config.database.url, config.database.options);
  }
}
