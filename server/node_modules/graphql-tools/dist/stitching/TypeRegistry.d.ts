import { GraphQLSchema, GraphQLNamedType, GraphQLType, InlineFragmentNode } from 'graphql';
export default class TypeRegistry {
    fragmentReplacements: {
        [typeName: string]: {
            [fieldName: string]: InlineFragmentNode;
        };
    };
    private types;
    private schemaByField;
    constructor();
    getSchemaByField(operation: 'query' | 'mutation', fieldName: string): GraphQLSchema;
    getAllTypes(): Array<GraphQLNamedType>;
    getType(name: string): GraphQLNamedType;
    resolveType<T extends GraphQLType>(type: T): T;
    addSchema(schema: GraphQLSchema): void;
    addType(name: string, type: GraphQLNamedType, onTypeConflict?: (leftType: GraphQLNamedType, rightType: GraphQLNamedType) => GraphQLNamedType): void;
    addFragment(typeName: string, fieldName: string, fragment: string): void;
}
