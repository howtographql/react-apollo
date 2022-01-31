# React & Apollo Tutorial

This is the sample project that belongs to the [React & Apollo Tutorial](https://www.howtographql.com/react-apollo/0-introduction/) on How to GraphQL.

## How to use

### 1. Clone repository

```sh
git clone https://github.com/howtographql/react-apollo/
```


### 2. Start the backend server

Go to the `server` folder, install dependencies and start the server. 

```sh
cd react-apollo/server
yarn install
yarn dev
```

> **Note**: If you want to interact with the GraphQL API of the server inside a [GraphQL Playground](https://github.com/prisma/graphql-playground), you can navigate to [http://localhost:4000](http://localhost:4000).


### 3. Run the app

Now that the server is running, you can start the React app as well. The commands need to be run in a new terminal tab/window inside the root directory `react-apollo` (because the current tab is blocked by the process running the server):

```sh
yarn install
yarn start
```

You can now open your browser and use the app on [http://localhost:3000](http://localhost:3000).
