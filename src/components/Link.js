import React from 'react';
import { FEED_QUERY } from './LinkList';
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
      },
      update(cache, { data: { vote } }) {
        const { feed } = cache.readQuery({
          query: FEED_QUERY
        });

        const updatedLinks = feed.links.map((feedLink) => {
          if (feedLink.id === link.id) {
            return {
              ...feedLink,
              votes: [...feedLink.votes, vote]
            };
          }
          return feedLink;
        });

        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            feed: {
              links: updatedLinks
            }
          }
        });
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
