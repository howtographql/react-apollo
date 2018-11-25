import { Component } from 'react';
import PropTypes from 'prop-types';

const PRISMA_TOKEN = process.env.REACT_APP_PRISMA_TOKEN;

class Mutation extends Component {
  static propTypes = {
    mutation: PropTypes.string.isRequired
  };

  state = {
    loading: false,
    error: null,
    data: null
  };

  mutateData = variables => {
    this.setState({ loading: true, error: null }, () => {
      fetch('http://localhost:4466/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PRISMA_TOKEN}`
        },
        body: JSON.stringify({
          query: this.props.mutation,
          variables
        })
      })
        .then(response => {
          return response.json();
        })
        .then(responseAsJson => {
          if (responseAsJson.errors) {
            this.setState({
              loading: false,
              error: responseAsJson.errors[0],
              data: responseAsJson.data
            });
          } else {
            this.setState({
              loading: false,
              error: null,
              data: responseAsJson.data
            });
          }
        })
        .catch(error => {
          this.setState({ loading: false, error, data: null });
        });
    });
  };

  render() {
    return this.props.children({
      mutate: this.mutateData,
      loading: this.state.loading,
      error: this.state.error,
      data: this.state.data
    });
  }
}

export default Mutation;
