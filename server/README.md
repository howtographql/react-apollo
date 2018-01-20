# hackernews-graphql-js

This repository contains the final project for the [**GraphQL.js tutorial**](https://www.howtographql.com/graphql-js/0-introduction/) on [How to GraphQL](https://www.howtographql.com/). Note that it also serves as foundation for all frontend tutorials on the site.

## Usage

### 1. Clone repository

```sh
git clone https://github.com/howtographql/graphql-js
cd graphql-js
```

### 2. Deploy the Prisma database service

```sh
prisma deploy
```

When prompted where (i.e. to which _cluster_) you want to deploy your service, choose any of the public clusters, e.g. `public-us1` or `public-eu1`. (If you have Docker installed, you can also deploy locally.)

### 3. Set the Prisma service endpoint

From the output of the previous command, copy the `HTTP` endpoint and paste it into `src/index.js` where it's used to instantiate the `Prisma` binding. You need to replace the current placeholder `__PRISMA_ENDPOINT`:

```js
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: "__PRISMA_ENDPOINT__",
      secret: 'mysecret123',
    }),
  }),
})
```

For example:

```js
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: "https://eu1.prisma.sh/public-hillcloak-flier-942261/hackernews-graphql-js/dev",
      secret: 'mysecret123',
    }),
  }),
})
```

Note that the part `public-hillcloak-flier-952361` of the URL is unique to your service.

### 4. Start the server & open Playground

To interact with the API in a GraphQL Playground, all you need to do is execute the `dev` script defined in `package.json`:

```sh
yarn dev
```
