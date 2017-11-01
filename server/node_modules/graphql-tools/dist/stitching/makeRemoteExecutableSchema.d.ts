import { ApolloLink } from 'apollo-link';
import { GraphQLSchema, ExecutionResult } from 'graphql';
export declare type Fetcher = (operation: FetcherOperation) => Promise<ExecutionResult>;
export declare type FetcherOperation = {
    query: string;
    operationName?: string;
    variables?: {
        [key: string]: any;
    };
    context?: {
        [key: string]: any;
    };
};
export default function makeRemoteExecutableSchema({schema, link, fetcher}: {
    schema: GraphQLSchema;
    link?: ApolloLink;
    fetcher?: Fetcher;
}): GraphQLSchema;
