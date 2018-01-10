import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class Search extends Component {
  state = {
    links: [],
    searchText: '',
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={e => this.setState({ searchText: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { searchText } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { searchText },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($searchText: String!) {
    feed(filter: $searchText) {
      links {
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

export default withApollo(Search)
