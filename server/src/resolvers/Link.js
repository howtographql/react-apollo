const { ApolloError } = require('apollo-server');

const postedBy = async (parent, args, context) => {
  try {
    const link = await context.prisma.link.findOne({
      where: { id: parent.id }
    });
    return await context.prisma.user.findOne({
      where: { id: link.userId }
    });
  } catch (err) {
    throw new ApolloError(err);
  }
};

const votes = async (parent, args, context) => {
  try {
    return await context.prisma.vote.findMany({
      where: {
        link: {
          id: parent.id
        }
      }
    });
  } catch (err) {
    throw new ApolloError(err);
  }
};

module.exports = {
  postedBy,
  votes
};
