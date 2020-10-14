const { ApolloError } = require('apollo-server');

const info = async () => {
  return 'hello world!';
};

const feed = async (parent, args, context) => {
  try {
    const links = await context.prisma.link.findMany({
      where: {
        OR: [
          {
            url: {
              contains: args.filter
            }
          },
          {
            description: {
              contains: args.filter
            }
          }
        ]
      },
      skip: args.skip,
      take: args.take
    });

    const count = await context.prisma.link.count({
      where: {
        OR: [
          {
            url: {
              contains: args.filter
            }
          },
          {
            description: {
              contains: args.filter
            }
          }
        ]
      }
    });

    return {
      id: args.skip,
      links,
      count
    };
  } catch (err) {
    throw new ApolloError(err);
  }
};

module.exports = {
  info,
  feed
};
