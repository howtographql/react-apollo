import { DefinitionNode, GraphQLNamedType } from 'graphql';
import TypeRegistry from './TypeRegistry';
export default function typeFromAST(typeRegistry: TypeRegistry, node: DefinitionNode): GraphQLNamedType | null;
