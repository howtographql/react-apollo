import { FieldNode, SelectionNode, DocumentNode } from 'graphql';
export declare type DirectiveInfo = {
    [fieldName: string]: {
        [argName: string]: any;
    };
};
export declare function getDirectiveInfoFromField(field: FieldNode, variables: Object): DirectiveInfo;
export declare function shouldInclude(selection: SelectionNode, variables?: {
    [name: string]: any;
}): boolean;
export declare function flattenSelections(selection: SelectionNode): SelectionNode[];
export declare function getDirectiveNames(doc: DocumentNode): any;
export declare function hasDirectives(names: string[], doc: DocumentNode): any;
