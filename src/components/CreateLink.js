import React, { Component, useState } from 'react';
import gql from 'graphql-tag';
import { FEED_QUERY } from './LinkList';
import { LINKS_PER_PAGE } from '../constants';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';

const POST_MUTATION = gql`
  mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    createPost(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });
  const [createLink] = useMutation(POST_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url
    },
    onCompleted: () => history.push('/new/1')
  });
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value
              })
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
