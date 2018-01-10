function links(parent, args, context, info) {
  const { linkIds } = parent
  return context.db.query.links({ where: { id_in: linkIds } }, info)
}

module.exports = {
  links,
}
