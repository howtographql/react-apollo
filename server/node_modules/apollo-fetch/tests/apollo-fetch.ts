import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { isEqual } from 'lodash';
import gql from 'graphql-tag';
import { print } from 'graphql';
import * as fetchMock from 'fetch-mock';
import {
  createApolloFetch,
  constructDefaultOptions,
} from '../src/apollo-fetch';
import { RequestAndOptions, FetchResult } from '../src/types';

chai.use(chaiAsPromised);

const { assert, expect } = chai;

const sampleQuery = gql`
  query SampleQuery {
    stub {
      id
    }
  }
`;

const simpleQueryWithNoVars = gql`
  query people {
    allPeople(first: 1) {
      people {
        name
      }
    }
  }
`;

const simpleQueryWithVar = gql`
  query people($personNum: Int!) {
    allPeople(first: $personNum) {
      people {
        name
      }
    }
  }
`;

const simpleResult = {
  data: {
    allPeople: {
      people: [
        {
          name: 'Luke Skywalker',
        },
      ],
    },
  },
};

const complexQueryWithTwoVars = gql`
  query people($personNum: Int!, $filmNum: Int!) {
    allPeople(first: $personNum) {
      people {
        name
        filmConnection(first: $filmNum) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

const complexResult = {
  data: {
    allPeople: {
      people: [
        {
          name: 'Luke Skywalker',
          filmConnection: {
            edges: [
              {
                node: {
                  id: 'ZmlsbXM6MQ==',
                },
              },
            ],
          },
        },
      ],
    },
  },
};

const swapiUrl = 'http://graphql-swapi.test/';
const unauthorizedUrl = 'http://unauthorized.test/';
const forbiddenUrl = 'http://forbidden.test/';
const serviceUnavailableUrl = 'http://service-unavailable.test/';
const missingUrl = 'http://does-not-exist.test/';

const swapiResolver = (url, opts) => {
  const { query, variables } = JSON.parse(
    (opts as RequestInit).body!.toString(),
  );

  if (query === print(simpleQueryWithNoVars)) {
    return simpleResult;
  }

  if (
    query === print(simpleQueryWithVar) &&
    isEqual(variables, { personNum: 1 })
  ) {
    return simpleResult;
  }

  if (
    query === print(complexQueryWithTwoVars) &&
    isEqual(variables, { personNum: 1, filmNum: 1 })
  ) {
    return complexResult;
  }
  throw new Error('Invalid Query');
};

describe('apollo-fetch', () => {
  describe('single request', () => {
    const postData = { hello: 'world', method: 'POST' };
    const data = JSON.stringify({ data: { hello: 'world', uri: '/graphql' } });
    const alternateData = JSON.stringify({
      data: { hello: 'alternate world', uri: 'alternate' },
    });
    const unparsableData = 'raw string';
    const unauthorizedData = {
      data: {
        user: null,
      },
    };

    const mockError = { throws: new TypeError('mock me') };

    before(() => {
      fetchMock.post('/graphql', data);
      fetchMock.post('alternate', alternateData);
      fetchMock.post('/raw', unparsableData);
      fetchMock.post('data', postData);
      fetchMock.post('error', mockError);
      fetchMock.post('test', data);

      fetchMock.post(unauthorizedUrl, unauthorizedData);

      fetchMock.post(swapiUrl, swapiResolver);
      fetchMock.post(missingUrl, () => {
        throw new Error('Network error');
      });

      fetchMock.post(forbiddenUrl, 403);
      fetchMock.post(serviceUnavailableUrl, 503);
    });

    afterEach(fetchMock.reset);

    after(fetchMock.restore);

    it('should not throw with no arguments', () => {
      assert.doesNotThrow(createApolloFetch);
    });

    it('should call fetch', () => {
      const fetcher = createApolloFetch();
      const result = fetcher({ query: print(sampleQuery) });
      return result.then(response => {
        assert.deepEqual(fetchMock.calls('/graphql').length, 1);
        assert.deepEqual(response, JSON.parse(data));
      });
    });

    const callAndCheckFetch = (uri, fetcher) => {
      const result = fetcher({ query: print(sampleQuery) });

      return result.then(response => {
        //correct response
        assert.deepEqual(response, JSON.parse(data));

        assert.deepEqual(fetchMock.lastCall(uri)[0], uri);
        const options = fetchMock.lastCall(uri)[1];
        const body = JSON.parse((<RequestInit>options).body);
        assert.deepEqual(options.method, 'POST');
        assert.deepEqual(options.headers, {
          Accept: '*/*',
          'Content-Type': 'application/json',
        });
        assert.deepEqual(body.query, print(sampleQuery));
      });
    };

    it('should call fetch with correct arguments and result', () => {
      const uri = 'test';
      const fetcher = createApolloFetch({ uri });
      return callAndCheckFetch(uri, fetcher);
    });

    it('should make two successful requests', () => {
      const uri = 'test';
      const fetcher = createApolloFetch({ uri });
      return callAndCheckFetch(uri, fetcher).then(() =>
        callAndCheckFetch(uri, fetcher),
      );
    });

    it('should pass an error onto the Promise', () => {
      const uri = 'error';
      const fetcher = createApolloFetch({ uri, customFetch: fetch });
      const result = fetcher({ query: print(sampleQuery) });
      return assert.isRejected(
        result,
        mockError.throws,
        mockError.throws.message,
      );
    });

    it('should catch on a network error', () => {
      const fetcher = createApolloFetch({ uri: forbiddenUrl });
      const result = fetcher({ query: print(sampleQuery) });
      return result.then(expect.fail).catch(error => {
        assert.deepEqual(
          error.message,
          'Network request failed with status 403 - "Forbidden"',
        );
        assert.isDefined(error.response);
        assert.isDefined(error.parseError);
      });
    });

    it('should return a fail to parse response when fetch returns raw response', () => {
      const fetcher = createApolloFetch({ uri: '/raw' });
      const result = fetcher({ query: print(sampleQuery) });
      return result.then(expect.fail).catch(error => {
        assert.deepEqual(
          error.message,
          'Network request failed to return valid JSON',
        );
        assert.isDefined(error.response);
        assert.deepEqual(error.response.raw, unparsableData);
      });
    });

    it('should pass the parsed response if valid regardless of the status', () => {
      const fetcher = createApolloFetch({
        uri: unauthorizedUrl,
        customFetch: () =>
          new Promise((resolve, reject) => {
            const init = {
              status: 401,
              statusText: 'Unauthorized',
            };
            const body = JSON.stringify(unauthorizedData);
            resolve(new Response(body, init));
          }),
      });

      return fetcher({ query: print(sampleQuery) }).then(result => {
        assert.deepEqual(result.data, unauthorizedData.data);
      });
    });
  });

  describe('middleware', () => {
    before(() => {
      fetchMock.post(swapiUrl, swapiResolver);
    });

    afterEach(fetchMock.reset);
    after(fetchMock.restore);

    it('should throw an error if middleware is not a function', () => {
      const malWare: any = {};
      const apolloFetch = createApolloFetch({ uri: '/graphql' });

      try {
        apolloFetch.use(malWare);
        expect.fail();
      } catch (error) {
        assert.equal(error.message, 'Middleware must be a function');
      }
    });

    it('should return errors thrown in middlewares', () => {
      const apolloFetch = createApolloFetch({ uri: swapiUrl });
      apolloFetch.use(() => {
        throw Error('Middleware error');
      });

      const simpleRequest = {
        query: print(simpleQueryWithNoVars),
        variables: {},
        debugName: 'People query',
      };

      return assert.isRejected(
        apolloFetch(simpleRequest),
        Error,
        'Middleware error',
      );
    });

    it('can alter the request variables', () => {
      const testWare1 = TestWare([{ key: 'personNum', val: 1 }]);

      const swapi = createApolloFetch({ uri: swapiUrl });
      swapi.use(testWare1);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(simpleQueryWithVar),
        variables: {},
        debugName: 'People query',
      };

      return assert.eventually.deepEqual(swapi(simpleRequest), simpleResult);
    });

    it('can alter the options', () => {
      const testWare1 = TestWare([], [{ key: 'planet', val: 'mars' }]);

      const swapi = createApolloFetch({ uri: swapiUrl });
      swapi.use(testWare1);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(simpleQueryWithNoVars),
        variables: {},
        debugName: 'People query',
      };

      return swapi(simpleRequest).then(() => {
        assert.equal((fetchMock.lastCall()[1] as any).planet, 'mars');
      });
    });

    it('can alter the request body params', () => {
      const testWare1 = TestWare(
        [],
        [],
        [{ key: 'newParam', val: '0123456789' }],
      );

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi.use(testWare1);
      const simpleRequest = {
        query: print(simpleQueryWithVar),
        variables: { personNum: 1 },
        debugName: 'People query',
      };

      return swapi(simpleRequest).then(() => {
        return assert.deepEqual(
          JSON.parse((fetchMock.lastCall()[1] as any).body),
          {
            query:
              'query people($personNum: Int!) {\n  allPeople(first: $personNum) {\n    people {\n      name\n    }\n  }\n}\n',
            variables: { personNum: 1 },
            debugName: 'People query',
            newParam: '0123456789',
          },
        );
      });
    });

    it('handle multiple middlewares', () => {
      const testWare1 = TestWare([{ key: 'personNum', val: 1 }]);
      const testWare2 = TestWare([{ key: 'filmNum', val: 1 }]);

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi.use(testWare1).use(testWare2);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {},
        debugName: 'People query',
      };

      return assert.eventually.deepEqual(swapi(simpleRequest), complexResult);
    });

    it('should chain use() calls', () => {
      const testWare1 = TestWare([{ key: 'personNum', val: 1 }]);
      const testWare2 = TestWare([{ key: 'filmNum', val: 1 }]);

      const swapi = createApolloFetch({ uri: swapiUrl });
      swapi.use(testWare1).use(testWare2);
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {},
        debugName: 'People query',
      };

      return assert.eventually.deepEqual(swapi(simpleRequest), complexResult);
    });
  });

  describe('afterware', () => {
    before(() => {
      fetchMock.post(swapiUrl, swapiResolver);
      fetchMock.post(forbiddenUrl, 403);
    });

    afterEach(fetchMock.reset);
    after(fetchMock.restore);

    it('should return errors thrown in afterwares', () => {
      const apolloFetch = createApolloFetch({ uri: swapiUrl });
      apolloFetch.useAfter(() => {
        throw Error('Afterware error');
      });

      const simpleRequest = {
        query: print(simpleQueryWithNoVars),
        variables: {},
        debugName: 'People query',
      };

      return assert.isRejected(
        apolloFetch(simpleRequest),
        Error,
        'Afterware error',
      );
    });

    it('should throw an error if afterware is not a function', () => {
      const malWare = {} as any;
      const apolloFetch = createApolloFetch({ uri: '/graphql' });

      try {
        apolloFetch.useAfter(malWare);
        expect.fail();
      } catch (error) {
        assert.equal(error.message, 'Afterware must be a function');
      }
    });

    it('can modify response to add data when response is not parsable', () => {
      const parsedData = {
        data: {
          mock: 'stub',
        },
      };
      const afterware = ({ response }, next) => {
        assert.deepEqual(response.status, 403);
        assert.deepEqual(response.raw, '');
        assert.isUndefined(response.parsed);

        response.parsed = parsedData;
        next();
      };
      const apolloFetch = createApolloFetch({ uri: forbiddenUrl });

      apolloFetch.useAfter(afterware);

      return assert.eventually.deepEqual(
        apolloFetch({ query: '' }),
        parsedData,
      );
    });

    it('handle multiple afterware', () => {
      const spy = sinon.spy();
      const afterware1 = ({ response }, next) => {
        assert.deepEqual(response.status, 200);
        spy();
        next();
      };
      const afterware2 = ({ response }, next) => {
        spy();
        next();
      };

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi.useAfter(afterware1);
      swapi.useAfter(afterware2);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {
          personNum: 1,
          filmNum: 1,
        },
        debugName: 'People query',
      };

      return swapi(simpleRequest)
        .then(result => {
          assert.deepEqual(result, <FetchResult>complexResult);
          assert(spy.calledTwice, 'both afterware should be called');
        })
        .catch(console.log);
    });
  });

  describe('multiple requests', () => {
    before(() => {
      fetchMock.post(swapiUrl, swapiResolver);
    });

    afterEach(fetchMock.reset);
    after(fetchMock.restore);

    it('handle multiple middlewares', () => {
      const testWare1 = TestWare([{ key: 'personNum', val: 1 }]);
      const testWare2 = TestWare([{ key: 'filmNum', val: 1 }]);

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi.use(testWare1).use(testWare2);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {},
        debugName: 'People query',
      };

      return assert.eventually
        .deepEqual(swapi(simpleRequest), complexResult)
        .then(() =>
          assert.eventually.deepEqual(swapi(simpleRequest), complexResult),
        );
    });

    it('handle multiple afterware', () => {
      const spy = sinon.spy();

      const afterware1 = ({ response }, next) => {
        assert.deepEqual(response.status, 200);
        spy();
        next();
      };
      const afterware2 = ({ response }, next) => {
        spy();
        next();
      };

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi.useAfter(afterware1).useAfter(afterware2);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {
          personNum: 1,
          filmNum: 1,
        },
        debugName: 'People query',
      };

      return swapi(simpleRequest)
        .then(result => {
          assert.deepEqual(result, <FetchResult>complexResult);
          assert(spy.calledTwice, 'both afterware should be called');
          spy.reset();
        })
        .then(() =>
          swapi(simpleRequest).then(result => {
            assert.deepEqual(result, <FetchResult>complexResult);
            assert(spy.calledTwice, 'both afterware should be called');
          }),
        );
    });

    it('handle multiple middleware and afterware', () => {
      const testWare1 = TestWare([{ key: 'personNum', val: 1 }]);
      const testWare2 = TestWare([{ key: 'filmNum', val: 1 }]);

      const spy = sinon.spy();

      const afterware1 = ({ response }, next) => {
        assert.deepEqual(response.status, 200);
        spy();
        next();
      };
      const afterware2 = ({ response }, next) => {
        spy();
        next();
      };

      const swapi = createApolloFetch({ uri: 'http://graphql-swapi.test/' });
      swapi
        .useAfter(afterware1)
        .useAfter(afterware2)
        .use(testWare1)
        .use(testWare2);
      // this is a stub for the end user client api
      const simpleRequest = {
        query: print(complexQueryWithTwoVars),
        variables: {},
        debugName: 'People query',
      };

      return swapi(simpleRequest)
        .then(result => {
          assert.deepEqual(result, <FetchResult>complexResult);
          assert(spy.calledTwice, 'both afterware should be called');
          spy.reset();
        })
        .then(() =>
          swapi(simpleRequest).then(result => {
            assert.deepEqual(result, <FetchResult>complexResult);
            assert(spy.calledTwice, 'both afterware should be called');
          }),
        );
    });
  });

  describe('batched query', () => {
    const data = { data: { hello: 'world', uri: '/graphql' } };
    const batch = [data, data];

    before(() => {
      fetchMock.post('batch', batch);
      fetchMock.post('failed batch', data);
    });

    afterEach(() => {
      fetchMock.reset();
    });

    it('should call Fetch with GraphQLRequest Array and return the array of FetchResults', () => {
      const apolloFetch = createApolloFetch({
        uri: 'batch',
      });

      const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];

      return apolloFetch(operations).then(results => {
        assert.deepEqual(results, batch);
        assert(fetchMock.called('batch'));
        assert.equal(fetchMock.calls('batch').length, 1);
        assert.deepEqual(
          (<RequestInit>fetchMock.lastCall('batch')[1]).body,
          JSON.stringify(operations),
        );
      });
    });

    it('should call Fetch with GraphQLRequest Array and return the array of FetchResults', () => {
      const apolloFetch = createApolloFetch({
        uri: 'batch',
      });

      const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];

      return apolloFetch(operations).then(results => {
        assert.deepEqual(results, batch);
        assert(fetchMock.called('batch'));
        assert.equal(fetchMock.calls('batch').length, 1);
        assert.deepEqual(
          (<RequestInit>fetchMock.lastCall('batch')[1]).body,
          JSON.stringify(operations),
        );
      });
    });

    it('should throw an error if response is not an array', done => {
      const apolloFetch = createApolloFetch({
        uri: 'failed batch',
      });

      const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];

      apolloFetch(operations).then(assert).catch(error => {
        done();
      });
    });
  });

  describe('batched Middleware', () => {
    it('should throw an error if not a function', () => {
      assert.throws(() => createApolloFetch().batchUse(<any>{}));
    });

    it('should get array GraphQLRequest and pass result to constructOptions', done => {
      const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];

      let receivedOpts;

      const apolloFetch = createApolloFetch({
        uri: 'batch',
        constructOptions: (request, options) => {
          assert(Array.isArray(request));

          const tmp = operations;
          tmp.push(simpleQueryWithVar);

          assert.deepEqual(operations, <any[]>request);

          receivedOpts.headers = {};
          receivedOpts.headers.stub = 'value';
          assert.deepEqual(receivedOpts, options);
          done();
          return constructDefaultOptions(request, options);
        },
      });

      apolloFetch.batchUse(({ requests, options }, next) => {
        assert.deepEqual(requests, operations);

        requests.push(simpleQueryWithVar);
        receivedOpts = { ...options };
        options.headers = {};
        options.headers.stub = 'value';

        next();
      });

      apolloFetch(operations);
    });
  });

  describe('batched Afterware', () => {
    const data = { data: { hello: 'world', uri: '/graphql' } };
    const batch = [data, data];
    const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];

    before(() => {
      fetchMock.post('batch', batch);
      fetchMock.post('401', 401);
    });

    afterEach(fetchMock.reset);
    after(fetchMock.restore);

    it('should throw an error if not a function', () => {
      assert.throws(() => createApolloFetch().batchUseAfter(<any>{}));
    });

    it('should get array of results return modified result', () => {
      const apolloFetch = createApolloFetch({
        uri: 'batch',
      });

      apolloFetch.batchUseAfter(({ response, options }, next) => {
        assert.deepEqual(response.parsed, batch);
        assert.deepEqual(fetchMock.lastCall()[1], options);
        assert(Array.isArray(response.parsed));
        response.parsed.push(data);

        next();
      });

      return apolloFetch(operations).then(results => {
        const tmp = [...batch];
        tmp.push(data);
        assert.deepEqual(results, tmp);
      });
    });

    it('should get access to the response status', done => {
      const apolloFetch = createApolloFetch({
        uri: '401',
      });

      apolloFetch.batchUseAfter(({ response, options }, next) => {
        assert.deepEqual(fetchMock.lastCall()[1], options);

        assert.isUndefined(response.parsed);
        assert.deepEqual(response.status, 401);
        done();
      });

      apolloFetch(operations);
    });
  });

  describe('constructOptions', () => {
    const operation = simpleQueryWithNoVars;
    const operations = [simpleQueryWithNoVars, simpleQueryWithNoVars];
    const opts = {
      headers: {
        stub: 'header',
      },
    };

    it('should pass single GraphQLRequest to constructOptions and call fetch with result', done => {
      const apolloFetch = createApolloFetch({
        uri: 'batch',
        customFetch: (uri, options) => {
          assert.deepEqual(uri, 'batch');
          assert.deepEqual(options, opts);
          return done();
        },
        constructOptions: (request, options) => {
          assert.deepEqual(request, operation);

          return { ...opts };
        },
      });

      apolloFetch(operation).catch(e => void 0);
    });

    it('should pass array of GraphQLRequest to constructOptions and call fetch with result', done => {
      const apolloFetch = createApolloFetch({
        uri: 'batch',
        customFetch: (uri, options) => {
          assert.deepEqual(uri, 'batch');
          assert.deepEqual(options.body, JSON.stringify(operations));
          delete options.body;
          assert.deepEqual(options, opts);
          throw done();
        },
        constructOptions: (request, options) => {
          assert.deepEqual(request, operations);

          return { ...opts, body: JSON.stringify(request) };
        },
      });

      apolloFetch(operations).catch(e => void 0);
    });
  });
});

// simulate middleware by altering variables and options
function TestWare(
  variables: Array<{ key: string; val: any }> = [],
  options: Array<{ key: string; val: any }> = [],
  bodyParams: Array<{ key: string; val: any }> = [],
) {
  return (request: RequestAndOptions, next: Function): void => {
    variables.map(variable => {
      (<any>request.request.variables)[variable.key] = variable.val;
    });

    options.map(variable => {
      (<any>request.options)[variable.key] = variable.val;
    });

    bodyParams.map(param => {
      request.request[param.key as string] = param.val;
    });

    next();
  };
}
