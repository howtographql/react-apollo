import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

// 1
const FEED_QUERY = gql`
  # 2
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

class LinkList extends Component {
    render() {
        return (
            <Query query={FEED_QUERY}>
                {(result) => {
                    if (result.loading) return <div>Loading</div>;
                    if (result.error) return <div>Error</div>;
                    
                    const { data } = result;
                    const linksToRender = data.feed.links;
                    
                    return <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>;
                }}
            </Query>
        )
    }
}

export default LinkList;