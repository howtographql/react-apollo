const { ApolloError } = require('apollo-server');

const links = async (parent, args, context) => {
  console.log('the parent', parent);
  try {
    return await context.prisma.link.findMany({
      where: {
        userId: parent.id
      }
    });
  } catch (err) {
    throw new ApolloError(err);
  }
};

module.exports = {
  links
};
