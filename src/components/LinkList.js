import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

// 1
export const FEED_QUERY = gql`
  # 2
  query FeedQuery {
    feed {
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

  render() {
    return (
      <Query query={FEED_QUERY}>
        {result => {
          if (result.loading) return <div>Loading</div>
          if (result.error) return <div>Error</div>

          const { data, subscribeToMore } = result
          const linksToRender = data.feed.links

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
            </div>
          )
        }}
      </Query>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // 1
    const data = store.readQuery({ query: FEED_QUERY })

    // 2
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // 3
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
}

export default LinkList
