import { DocumentNode, DirectiveNode } from 'graphql';
export declare type RemoveDirectiveConfig = {
    name?: string;
    test?: (directive: DirectiveNode) => boolean;
};
export declare function removeDirectivesFromDocument(directives: RemoveDirectiveConfig[], doc: DocumentNode): DocumentNode;
export declare function addTypenameToDocument(doc: DocumentNode): any;
export declare function removeConnectionDirectiveFromDocument(doc: DocumentNode): any;
