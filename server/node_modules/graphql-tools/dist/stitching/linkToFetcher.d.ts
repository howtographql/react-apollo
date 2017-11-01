import { Fetcher } from './makeRemoteExecutableSchema';
import { ApolloLink } from 'apollo-link';
export default function linkToFetcher(link: ApolloLink): Fetcher;
