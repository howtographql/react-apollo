const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

module.exports = { pubsub };
