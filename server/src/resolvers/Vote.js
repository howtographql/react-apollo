const { ApolloError } = require('apollo-server');

const link = async (parent, args, context) => {
  try {
    return await context.prisma.link.findOne({
      where: {
        id: parent.linkId
      }
    });
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
