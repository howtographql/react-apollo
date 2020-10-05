import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import * as resolvers from './resolvers';

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: () => ({
    prisma
  })
});

server.listen().then(({ port }) => {
  console.log(
    `Server listening on http://localhost:${port}`
  );
});
