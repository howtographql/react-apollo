const { pubsub } = require('./../pubsub');

const newLink = {
  subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
};
const newVote = {
  subscribe: () => pubsub.asyncIterator(['VOTE'])
};

module.exports = {
  newLink,
  newVote
};
