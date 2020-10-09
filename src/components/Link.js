import React from 'react';
import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

import { useMutation, gql } from '@apollo/client';

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
`;

const Link = (props) => {
  const { link } = props;
  const [vote, { loading, error, data }] = useMutation(
    VOTE_MUTATION,
    {
      variables: {
        linkId: link.id
      }
    }
  );
  return (
    <div className="flex mt2 items-start">
      {error && <p>{JSON.stringify(error, null, 2)}</p>}
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        <div
          className="ml1 gray f11"
          style={{ cursor: 'pointer' }}
          onClick={vote}
        >
          ▲
        </div>
        {/* {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: this.props.link.id }}
            update={(store, { data: { vote } }) =>
              this.props.updateStoreAfterVote(
                store,
                vote,
                this.props.link.id
              )
            }
          >
            {(voteMutation) => (
              <div
                className="ml1 gray f11"
                onClick={voteMutation}
              >
                ▲
              </div>
            )}
          </Mutation>
        )} */}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{' '}
          {link.postedBy ? link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
