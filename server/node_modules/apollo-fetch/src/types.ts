export interface ApolloFetch {
  (operation: GraphQLRequest): Promise<FetchResult>;
  (operation: GraphQLRequest[]): Promise<FetchResult[]>;
  use: (middlewares: MiddlewareInterface) => ApolloFetch;
  useAfter: (afterwares: AfterwareInterface) => ApolloFetch;
  batchUse: (middlewares: BatchMiddlewareInterface) => ApolloFetch;
  batchUseAfter: (afterwares: BatchAfterwareInterface) => ApolloFetch;
}

export interface GraphQLRequest {
  query?: string;
  variables?: object;
  operationName?: string;
}

export interface FetchResult {
  data: any;
  errors?: any;
  extensions?: any;
}

export type MiddlewareInterface = (
  request: RequestAndOptions,
  next: Function,
) => void;
export type BatchMiddlewareInterface = (
  requests: RequestsAndOptions,
  next: Function,
) => void;

export interface RequestAndOptions {
  request: GraphQLRequest;
  options: RequestInit;
}

export interface RequestsAndOptions {
  requests: GraphQLRequest[];
  options: RequestInit;
}

export type AfterwareInterface = (
  response: ResponseAndOptions,
  next: Function,
) => void;
export type BatchAfterwareInterface = (
  response: ResponseAndOptions,
  next: Function,
) => void;

export interface ResponseAndOptions {
  response: ParsedResponse;
  options: RequestInit;
}

export interface ParsedResponse extends Response {
  raw: string;
  parsed?: any;
}

export interface FetchOptions {
  uri?: string;
  customFetch?: (request: RequestInfo, init: RequestInit) => Promise<Response>;
  constructOptions?: (
    requestOrRequests: GraphQLRequest | GraphQLRequest[],
    options: RequestInit,
  ) => RequestInit;
}

export interface FetchError extends Error {
  response: ParsedResponse;
  parseError?: Error;
}

export interface BatchError extends Error {
  response: ParsedResponse;
}
