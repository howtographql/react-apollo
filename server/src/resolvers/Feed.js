function links(parent, args, context, info) {
  const { linkIds, orderBy } = parent
  const where = { id_in: linkIds }
  return context.db.query.links({ where, orderBy }, info)
}

module.exports = {
  links,
}
