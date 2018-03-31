import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
        id
        url
        description
        createdAt
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
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
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
        user {
          id
        }
      }
    }
  }
`

class NewLinksSubscription extends Component {
  componentDidMount() {
    this.props.subscribeToNewLinks()
  }
  render() {
    return null
  }
}

class NewVotesSubscription extends Component {
  componentDidMount() {
    this.props.subscribeToNewVotes()
  }
  render() {
    return null
  }
}

class LinkList extends Component {
  // Test to see if item is already in the store
  idAlreadyExists = (previous, subscriptionData) => {
    const { data: { newLink: { node: { id } } } } = subscriptionData
    return (
      previous.feed.links.filter(item => {
        return item.id === id
      }).length > 0
    )
  }

  getQueryVariables = () => {
    const page = parseInt(this.props.match.params.page, 10)
    const isNewPage = this.props.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return { first, skip, orderBy }
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this.getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Loading</div>
          if (error) return <div>Error</div>

          const isNewPage = this.props.location.pathname.includes('new')
          const linksToRender = this._getLinksToRender(isNewPage, data)
          const page = parseInt(this.props.match.params.page, 10)

          return (
            <div>
              <NewLinksSubscription
                subscribeToNewLinks={() =>
                  this._subscribeToNewLinks(subscribeToMore)
                }
              />
              <NewVotesSubscription
                subscribeToNewVotes={() =>
                  this._subscribeToNewVotes(subscribeToMore)
                }
              />
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                  index={index}
                  link={link}
                />
              ))}
              {isNewPage && (
                <div className="flex ml4 mv3 gray">
                  <div
                    className="pointer mr2"
                    onClick={() => this._previousPage()}
                  >
                    Previous
                  </div>
                  <div className="pointer" onClick={() => this._nextPage(data)}>
                    Next
                  </div>
                </div>
              )}
            </div>
          )
        }}
      </Query>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
    const first = isNewPage ? LINKS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    })

    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (previous, { subscriptionData }) => {
        if (!subscriptionData.data) return previous
        if (this.idAlreadyExists(previous, subscriptionData)) {
          return previous
        }

        const newAllLinks = [
          subscriptionData.data.newLink.node,
          ...previous.feed.links,
        ]
        const result = {
          ...previous,
          feed: {
            links: newAllLinks,
          },
        }
        return result
      },
    })
  }
  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    })
  }

  _getLinksToRender = (isNewPage, data) => {
    if (isNewPage) {
      return data.feed.links
    }
    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }
}

export default LinkList
