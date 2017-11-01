import { GraphQLCompositeType, GraphQLFieldConfigMap, GraphQLFieldMap, GraphQLInputObjectType, GraphQLSchema } from 'graphql';
import TypeRegistry from './TypeRegistry';
export declare function recreateCompositeType(schema: GraphQLSchema, type: GraphQLCompositeType | GraphQLInputObjectType, registry: TypeRegistry): GraphQLCompositeType | GraphQLInputObjectType;
export declare function fieldMapToFieldConfigMap(fields: GraphQLFieldMap<any, any>, registry: TypeRegistry): GraphQLFieldConfigMap<any, any>;
