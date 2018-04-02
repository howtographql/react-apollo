import React from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import LinkListSubscriptions from './LinkListSubscriptions'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`

const updateCacheAfterVote = (page, isNewPage, cache, createVote, linkId) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
  const first = isNewPage ? LINKS_PER_PAGE : 100
  const orderBy = isNewPage ? 'createdAt_DESC' : null
  const data = cache.readQuery({
    query: FEED_QUERY,
    variables: { first, skip, orderBy }
  })

  const votedLink = data.feed.links.find(link => link.id === linkId)
  votedLink.votes = createVote.link.votes
  cache.writeQuery({ query: FEED_QUERY, data })
}

const getQueryVariables = (page, isNewPage) => {
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
  const first = isNewPage ? LINKS_PER_PAGE : 100
  const orderBy = isNewPage ? 'createdAt_DESC' : null
  return { first, skip, orderBy }
}

const getLinksToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.feed.links
  }
  const rankedLinks = data.feed.links.slice()
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
  return rankedLinks
}

const nextPage = (page, data, history) => {
  if (page <= data.feed.count / LINKS_PER_PAGE) {
    const nextPage = page + 1
    history.push(`/new/${nextPage}`)
  }
}

const previousPage = (page, history) => {
  if (page > 1) {
    const previousPage = page - 1
    history.push(`/new/${previousPage}`)
  }
}

export default ({ match, location, history }) => {
  const isNewPage = location.pathname.includes('new')
  const page = parseInt(match.params.page, 10)
  return (
    <Query query={FEED_QUERY} variables={getQueryVariables(page, isNewPage)}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div>Fetching</div>
        if (error) return <div>Error</div>

        const linksToRender = getLinksToRender(isNewPage, data)

        return (
          <LinkListSubscriptions subscribeToMore={subscribeToMore}>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index}
                updateStoreAfterVote={updateCacheAfterVote.bind(
                  this,
                  page,
                  isNewPage
                )}
              />
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div
                  className="pointer mr2"
                  onClick={() => previousPage(page, history)}
                >
                  Previous
                </div>
                <div
                  className="pointer"
                  onClick={() => nextPage(page, data, history)}
                >
                  Next
                </div>
              </div>
            )}
          </LinkListSubscriptions>
        )
      }}
    </Query>
  )
}
