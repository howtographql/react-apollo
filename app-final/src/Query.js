import { Component } from 'react';
import PropTypes from 'prop-types';

const PRISMA_TOKEN = process.env.REACT_APP_PRISMA_TOKEN;

class Query extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    variables: PropTypes.object
  };

  static defaultProps = {
    variables: {}
  };

  state = {
    loading: false,
    error: null,
    data: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true, error: null }, () => {
      fetch('http://localhost:4466/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PRISMA_TOKEN}`
        },
        body: JSON.stringify({
          query: this.props.query,
          variables: this.props.variables
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
      refetch: this.fetchData,
      loading: this.state.loading,
      error: this.state.error,
      data: this.state.data
    });
  }
}

export default Query;
