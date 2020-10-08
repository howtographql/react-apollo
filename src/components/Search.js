import React, { Component, useState } from 'react';
import gql from 'graphql-tag';
import Link from './Link';
import { useQuery } from '@apollo/client';

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
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
`;

const SearchResults = ({ searchFilter, onCompleted }) => {
  const { data, loading, error } = useQuery(
    FEED_SEARCH_QUERY,
    {
      variables: {
        filter: searchFilter
      }
    }
  );
  return (
    <>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, setExecuteSearch] = useState(false);
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button onClick={() => setExecuteSearch(true)}>
          OK
        </button>
      </div>
      {executeSearch && (
        <SearchResults
          searchFilter={searchFilter}
          onCompleted={() => setExecuteSearch(false)}
        />
      )}
    </>
  );
};

export default Search;
