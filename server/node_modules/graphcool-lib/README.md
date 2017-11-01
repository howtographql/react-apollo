# graphcool-lib

## Install

```sh
yarn add graphcool-lib
```

## Usage

### `.api()`
#### Typescript
```ts
import { fromEvent, default as Graphcool, FunctionEvent } from 'graphcool-lib'

interface User {
  id: string
}

export default async (event: FunctionEvent) => {
  const lib: Graphcool = fromEvent(event)
  const client = lib.api('simple/v1')
  const {allUsers} = await client.request<{allUsers: User[]}>(`{allUsers{id}}`)

  return {
    data: {
      event: allUsers
    }
  }
}
```
#### Javascript
```js
import { fromEvent } from 'graphcool-lib'

export default async event => {
  const lib = fromEvent(event)
  const client = lib.api('simple/v1')
  const {allUsers} = await client.request(`{allUsers{id}}`)

  return {
    data: {
      event: allUsers
    }
  }
}

```

### `.generateNodeToken(nodeId, modelName)`
Using `.generateNodeToken` you can act on behalf of a User:
```ts
import { fromEvent } from 'graphcool-lib'

export default async event => {
  const client = fromEvent(event)
  const onbehalfToken = await client.generateAuthToken('cj8a9rex1i5eg0170k116mfme', 'User')
  const api = client.api('simple/v1', {token: onbehalfToken})
  const result = await api.request(`{allUsers{id}}`)

  return {
    data: {
      message: {
        result,
      }
    }
  }
}
```
