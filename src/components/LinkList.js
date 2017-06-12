import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import Link from './Link'
import { GC_USER_ID } from '../constants'

const LINKS_PER_PAGE = 2

class LinkList extends Component {

  componentDidMount() {
    this._subscribeToNewVotes()
    this._subscribeToNewLinks()
  }

  render() {
    if (this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }
    const userId = localStorage.getItem(GC_USER_ID)
    return (
      <div>
        {!userId ?
          <button onClick={() => {
            const { history } = this.props
            history.push('/login')
          }}>Login</button> :
          <button onClick={() => {
            const { history } = this.props
            history.push('/create')
          }}>New Post</button>
        }
        <div>
          {this.props.allLinksQuery.allLinks.map(link => (
            <Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote} link={link}/>
          ))}
        </div>
        <div>
          <button onClick={() => this._previousPage()}>previous</button>
          <button onClick={() => this._nextPage()}>next</button>
        </div>
      </div>
    )
  }

  _subscribeToNewLinks = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Link(filter: {
            mutation_in: [CREATED]
          }) {
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
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [
          subscriptionData.data.Link.node,
          ...previous.allLinks
        ]
        const result = {
          ...previous,
          allLinks: newAllLinks
        }
        return result
      }
    })
  }

  _subscribeToNewVotes = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Vote(filter: {
            mutation_in: [CREATED]
          }) {
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
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const votedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Vote.node.link.id)
        const link = subscriptionData.data.Vote.node.link
        const newAllLinks = previous.allLinks.slice()
        newAllLinks[votedLinkIndex] = link
        const result = {
          ...previous,
          allLinks: newAllLinks
        }
        return result
        // return Immutable.setIn(previous, ['allItems', 0], link)
      }
    })
  }

  _nextPage = () => {
    const { history } = this.props
    const page = this.props.match.params.page
    if (page <= this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE) {
      const nextPage = parseInt(page) + 1
      history.push(`/${nextPage}`)
    }
  }

  _previousPage = () => {
    const { history } = this.props
    const page = this.props.match.params.page
    if (page > 1) {
      const nextPage = parseInt(page) - 1
      history.push(`/${nextPage}`)
    }
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const { pathname } = this.props.location
    const page = parseInt(pathname.substring(1, pathname.length))
    const skip = (page - 1) * LINKS_PER_PAGE
    const first = LINKS_PER_PAGE
    const data = store.readQuery({ query: ALL_LINKS_QUERY, variables: { first, skip } })
    const votedLink = data.allLinks.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }

}

const ALL_LINKS_QUERY = gql`
  query AllLinksQuery($first: Int, $skip: Int) {
    allLinks(first: $first, skip: $skip) {
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
      }
    }
    _allLinksMeta {
      count
    }
  }
`

export default graphql(ALL_LINKS_QUERY, {
  name: 'allLinksQuery',
  options: (ownProps) => {
    const { pathname } = ownProps.location
    const page = parseInt(pathname.substring(1, pathname.length))
    return {
      variables: {
        skip: (page - 1) * LINKS_PER_PAGE,
        first: LINKS_PER_PAGE
      },
      fetchPolicy: 'network-only'
    }
  }
}) (LinkList)
