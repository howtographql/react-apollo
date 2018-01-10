# React & Apollo Tutorial

This is the sample project that belongs to the [React & Apollo Tutorial](https://www.howtographql.com/react-apollo/0-introduction/) on How to GraphQL.

## Running the App

### 1. Clone repository

```sh
git clone https://github.com/howtographql/react-apollo/
cd react-apollo
```

### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

If you haven't already, install the Graphcool CLI:

```sh
# Install Graphcool CLI
npm install -g graphcool
```

Once it's installed, you can start the GraphQL server:

```sh
cd server
yarn install
graphcool deploy
yarn start
```

### 3. Install dependencies & run locally

```sh
cd ..
yarn install
yarn start # open http://localhost:3000 in your browser
```