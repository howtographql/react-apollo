import { GraphQLResolveInfo } from 'graphql';
export declare function annotateWithChildrenErrors(object: any, childrenErrors: Array<{
    path?: Array<string | number>;
}>): any;
export declare function getErrorsFromParent(object: any, fieldName: string): {
    kind: 'OWN';
    error: any;
} | {
    kind: 'CHILDREN';
    errors?: Array<{
        path?: Array<string | number>;
    }>;
};
export declare function checkResultAndHandleErrors(result: any, info: GraphQLResolveInfo, responseKey?: string): any;
