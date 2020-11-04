const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');
const {
  ApolloError,
  AuthenticationError
} = require('apollo-server');
const { pubsub } = require('./../pubsub');

const createPost = async (
  parent,
  { url, description },
  context
) => {
  try {
    let data = {};
    if (!context.userId) {
      data = {
        url,
        description
      };
    } else {
      data = {
        url,
        description,
        postedBy: {
          connect: {
            id: context.userId
          }
        }
      };
    }
    const newLink = await context.prisma.link.create({
      data
    });
    pubsub.publish('POST_CREATED', {
      newLink
    });
    return newLink;
  } catch (err) {
    throw new ApolloError(err);
  }
};

const signup = async (
  parent,
  { name, email, password },
  context
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await context.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
      token,
      user
    };
  } catch (err) {
    throw new ApolloError(err);
  }
};

const login = async (
  parent,
  { email, password },
  context
) => {
  try {
    const user = await context.prisma.user.findFirst({
      where: {
        email
      }
    });
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new AuthenticationError('Invalid password');
    }

    return {
      token: jwt.sign({ userId: user.id }, APP_SECRET),
      user
    };
  } catch (err) {
    throw new ApolloError(err);
  }
};

const vote = async (parent, args, context) => {
  try {
    const alreadyVoted = await context.prisma.vote.findFirst(
      {
        where: {
          link: {
            id: args.linkId
          },
          user: {
            id: context.userId
          }
        }
      }
    );

    if (alreadyVoted) {
      throw new ApolloError(
        'User already voted for this link'
      );
    }

    const newVote = await context.prisma.vote.create({
      data: {
        link: {
          connect: {
            id: args.linkId
          }
        },
        user: {
          connect: {
            id: context.userId
          }
        }
      }
    });

    pubsub.publish('VOTE', {
      newVote
    });

    return newVote;
  } catch (err) {
    throw new ApolloError(err);
  }
};

module.exports = {
  createPost,
  signup,
  login,
  vote
};
