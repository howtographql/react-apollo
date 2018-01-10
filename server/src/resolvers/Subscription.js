const newLink = {
  subscribe: (parent, args, ctx, info) => {
    console.log(`new link resolver`)
    return ctx.db.subscription.link({}, info)
  },
}

const newVote = {
  subscribe: (parent, args, ctx, info) => {
    console.log(`new vote resolver`)
    return ctx.db.subscription.vote({}, info)
  },
}

module.exports = {
  newLink,
  newVote,
}
