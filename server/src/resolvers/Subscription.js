const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

function newLinkSubscribe(parent, args, context, info) {
  return context.prisma.$subscribe
    .link({ mutation_in: ['CREATED'] })
    .node();
}

const newLink = {
  subscribe: () => pubsub.asyncIterator(['CREATED']),
  resolve: (payload) => {
    return payload;
  }
};

function newVoteSubscribe(parent, args, context, info) {
  return context.prisma.$subscribe
    .vote({ mutation_in: ['CREATED'] })
    .node();
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload;
  }
};

module.exports = {
  newLink,
  newVote
};
