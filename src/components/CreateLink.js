import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

// 1
const POST_MUTATION = gql`
  # 2
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
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
`

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ description, url }}
          update={(cache, { data: { post } }) => {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data = cache.readQuery({
              query: FEED_QUERY,
              variables: { first, skip, orderBy },
            })
            data.feed.links.splice(0, 0, post)
            data.feed.links.pop()
            cache.writeQuery({
              query: FEED_QUERY,
              data,
              variables: { first, skip, orderBy },
            })
          }}
        >
          {postMutation => (
            <button
              onClick={() =>
                postMutation() && this.props.history.push(`/new/1`)
              }
            >
              Submit
            </button>
          )}
        </Mutation>
      </div>
    )
  }
}

// 3
export default CreateLink
