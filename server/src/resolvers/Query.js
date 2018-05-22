async function feed(parent, args, ctx, info) {
  const { filter, first, skip, orderBy } = args // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {}

  const allLinks = await ctx.db.query.links({})
  const count = allLinks.length

  const queriedLinks = await ctx.db.query.links({ first, skip, where, orderBy })

  return {
    linkIds: queriedLinks.map(link => link.id),
    count,
    orderBy
  }
}

module.exports = {
  feed,
}
