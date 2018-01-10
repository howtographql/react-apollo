function feed(parent, args, ctx, info) {
  const { search, first, skip } = args // destructure input arguments
  const where = search
    ? { OR: [{ url_contains: search }, { description_contains: search }] }
    : {}

  return ctx.db.query.links({ first, skip, where }, info)
}

module.exports = {
  feed,
}