import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import { GC_USER_ID } from '../constants'

class Link extends Component {

  render() {

    const userId = localStorage.getItem(GC_USER_ID)
    console.log(`Link - userId:`, userId)
    return (
      <div>
        {userId && <div onClick={() => this._voteForLink()}>▲</div>}
        <div>{this.props.link.description} ({this.props.link.url})</div>
        <div>{this.props.link.votes.length} votes | by {this.props.link.postedBy.name} {this.props.link.createdAt}</div>
      </div>
    )
  }

  _voteForLink = async () => {
    const linkId = this.props.link.id
    const userId = localStorage.getItem(GC_USER_ID)
    await this.props.createVoteMutation({
      variables: {
        userId,
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.props.updateStoreAfterVote(store, createVote, linkId)
      }
    })
  }

}

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
        }
      }
    }
  }
`

export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Link)

