const { ApolloError } = require('apollo-server');

const link = async (parent, args, context) => {
  try {
    console.log(parent);
    return context.prisma.vote({ id: parent.id }).link();
  } catch (err) {
    throw new ApolloError(err);
  }
};

const user = async (parent, args, context) => {
  try {
    return context.prisma.user.findOne({
      where: {
        id: parent.userId
      }
    });
  } catch (err) {
    throw new ApolloError(err);
  }
};

module.exports = {
  link,
  user
};
