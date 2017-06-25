import React, { Component } from 'react'
import { gql, withApollo } from 'react-apollo'
import Link from './Link'

class Search extends Component {

  state = {
    links: [],
    searchText: ''
  }

  render() {
    return (
      <div className='mv3'>
        <div className='flex'>
          <input
            type='text'
            onChange={(e) => this.setState({ searchText: e.target.value })}
          />
          <div className='button ml2'
            onClick={() => this._executeSearch()}
          >
            search
          </div>
        </div>
        {this.state.links.map((link, index) => <Link key={link.id} index={index} link={link}/>)}
      </div>
    )
  }

  _executeSearch = async () => {
    const { searchText } = this.state
    const result = await this.props.client.query({
      query: ALL_LINKS_SEARCH_QUERY,
      variables: { searchText }
    })
    const links = result.data.allLinks
    this.setState({ links })
  }

}

const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
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
`

export default withApollo(Search)