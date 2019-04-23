import React from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ListItem, ListItemIcon, IconButton, ListItemText, withStyles } from '@material-ui/core';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`

const style = {
  vote: {
    padding: 0,
    margin: 0,
  },
  link: {
    padding: 0,
    margin: 0,
  }
}

function Link(props) {
  const authToken = localStorage.getItem(AUTH_TOKEN)
  const {classes} = props
  const { link } = props
  return (
    <ListItem key={link.id}>
    <>
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: link.id }}
            update={(store, { data: { vote } }) =>
              props.updateStoreAfterVote(store, vote, link.id)
            }
          >
            {voteMutation => (
              <ListItemIcon onClick={voteMutation} className={classes.vote}>
                <IconButton>▲</IconButton>
              </ListItemIcon>
            )}
          </Mutation>
        )}
      <ListItemText className={classes.link}>
      <div>
        <a  href={link.url}>{link.description}</a> ({link.url})
      </div>
        {link.votes.length} votes | by{' '}
        {link.postedBy
          ? link.postedBy.name
          : 'Unknown'}{' '}
        {timeDifferenceForDate(link.createdAt)}
      </ListItemText>
    </>
    </ListItem>
  )
}

export default withStyles(style)(Link)