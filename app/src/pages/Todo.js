import React, { Component } from "react";
import "./Todo.css";

import Query from "./Query";
import Mutation from './Mutation';

export class Todo extends Component {
  state = { count: "3" };

  handleCountChange = e => {
    this.setState({ count: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.fetchData();
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
        {({ refetch, loading, error, data }) => (
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
                  {data.todoItems.map(todoItem => (
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
                      key={todoItem.id}
                    >
                      {({ mutate, data }) => {
                        const mutationResultExists = Boolean(data);
                        const completed = mutationResultExists
                          ? data.updateTodoItem.completed
                          : todoItem.completed;

                        return (
                          <li
                            className={
                              completed ? "item-complete" : "item-incomplete"
                            }
                            onClick={() =>
                              mutate({
                                where: { id: todoItem.id },
                                data: { completed: !completed,}
                              })
                            }
                          >
                            {todoItem.text}
                          </li>
                        );
                      }}
                    </Mutation>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Query>
    );
  }
}