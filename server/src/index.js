const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const { getUserId } = require('./utils');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      return {
        prisma,
        userId: req.headers.authorization
          ? getUserId(req)
          : null
      };
    }
  },
  subscriptions: {
    onConnect: (connectionParams) => {
      if (connectionParams.authToken) {
        return {
          prisma,
          userId: getUserId(
            null,
            connectionParams.authToken
          )
        };
      } else {
        return {
          prisma
        };
      }
    }
  }
});

server.listen(process.env.PORT || 4000).then(({ port }) => {
  console.log(
    `Server listening on http://localhost:${port}`
  );
});
