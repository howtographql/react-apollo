const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const { getUserId } = require('./utils');

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    prisma,
    userId: req.headers.authorization
      ? getUserId(req)
      : null
  })
});

server.listen(process.env.PORT || 4000).then(({ port }) => {
  console.log(
    `Server listening on http://localhost:${port}`
  );
});
