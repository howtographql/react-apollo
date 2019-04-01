import { Component } from "react";
import PropTypes from "prop-types";

class Mutation extends Component {
  static propTypes = {
    mutation: PropTypes.string.isRequired,
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

  mutateData = variables => {
    this.setState({ loading: true, error: null }, () => {
      fetch("http://192.168.99.100:4466/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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