import React, { Component } from "react";
import "./App.css";

import Query from "./Query";
import Mutation from "./Mutation";

class App extends Component {
  state = {
    count: "3"
  };

  handleCountChange = e => {
    this.setState({ count: e.target.value });
  };

  render() {
    return (
      <Query
        query={`
            query($count: Int) {
              todoItems(first: $count) {
                id
                text
                completed
              }
            }
          `}
        variables={{
          count: parseInt(this.state.count)
        }}
      >
        {({ refetch, loading, error, data }) => {
          return (
            <div className="app">
              <form
                className="count-form"
                onSubmit={e => {
                  e.preventDefault();

                  refetch();
                }}
              >
                <input
                  type="number"
                  value={this.state.count}
                  onChange={this.handleCountChange}
                />
                <button type="submit">Submit</button>
              </form>
              <div className="item-list-container">
                <h1>To-do items:</h1>
                {error && <p>{error.message}</p>}
                {loading && <p>Loading...</p>}
                {data && (
                  <ul className="item-list">
                    {data.todoItems.map(({ id, text, completed }) => (
                      <Mutation
                        mutation={`
                        mutation(
                          $where: TodoItemWhereUniqueInput!
                          $data: TodoItemUpdateInput!
                        ) {
                          updateTodoItem(where: $where, data: $data) {
                            id
                            text
                            completed
                          }
                        }
                      `}
                        key={id}
                      >
                        {({ mutate, data }) => {
                          const mutationResultExists = Boolean(data);
                          const completedState = mutationResultExists
                            ? data.updateTodoItem.completed
                            : completed;

                          return (
                            <li
                              className={
                                completedState
                                  ? "item-complete"
                                  : "item-incomplete"
                              }
                              onClick={() =>
                                mutate({
                                  where: { id },
                                  data: { completed: !completedState }
                                })
                              }
                            >
                              {text}
                            </li>
                          );
                        }}
                      </Mutation>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default App;
