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

Once it's installed, you can deploy the Graphcool service based on the existing definition inside the [`server`](./server) directory:

```sh
cd server
yarn install
graphcool deploy server
```

When prompted which cluster you want to deploy to, choose any of the **Shared Clusters** options (`shared-eu-west-1`, `shared-ap-northeast-1` or `shared-us-west-2`).

### 3. Connect the app with your GraphQL API

Paste the service ID (which you find in the generated `.graphcoolrc` file inside the `server` directory or by running `graphcool info`) into `./src/index.js` replacing the current placeholder `__SERVICE_ID__`. 

### 4. Install dependencies & run locally

```sh
cd ..
yarn install
yarn start # open http://localhost:3000 in your browser
```


