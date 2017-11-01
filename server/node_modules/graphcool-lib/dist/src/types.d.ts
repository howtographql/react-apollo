export interface GraphcoolOptions {
    endpoints?: Partial<Endpoints>;
    token?: string;
}
export interface FunctionEvent<T extends any = {}> {
    data: T;
    context: Context;
}
export interface Context {
    request: RequestContext;
    graphcool: GraphcoolContext;
    environment: any;
    auth: AuthContext;
    sessionCache: any;
}
export interface RequestContext {
    sourceIp: string;
    headers: any;
    httpMethod: 'post' | 'put';
}
export interface Endpoints {
    simple: string;
    relay: string;
    system: string;
    subscriptions: string;
}
export interface GraphcoolContext {
    rootToken: string;
    serviceId?: string;
    alias: string;
    projectId?: string;
    endpoints: Endpoints;
}
export interface AuthContext {
    nodeId: string;
    typeName: string;
    token: string;
}
export interface ScalarObject {
    [key: string]: ScalarOrScalarObject;
}
export declare type ScalarOrScalarObject = ScalarObject | number | string | boolean;
export interface APIOptions {
    token?: string;
}
export declare type APIEndpoint = 'simple/v1' | 'relay/v1' | 'system';
