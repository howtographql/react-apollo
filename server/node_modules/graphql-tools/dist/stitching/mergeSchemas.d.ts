import { GraphQLNamedType, GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import { IResolvers } from '../Interfaces';
export declare type MergeInfo = {
    delegate: (type: 'query' | 'mutation', fieldName: string, args: {
        [key: string]: any;
    }, context: {
        [key: string]: any;
    }, info: GraphQLResolveInfo) => any;
};
export default function mergeSchemas({schemas, onTypeConflict, resolvers}: {
    schemas: Array<GraphQLSchema | string>;
    onTypeConflict?: (leftType: GraphQLNamedType, rightType: GraphQLNamedType) => GraphQLNamedType;
    resolvers?: (mergeInfo: MergeInfo) => IResolvers;
}): GraphQLSchema;
