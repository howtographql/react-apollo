"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var apollo_utilities_1 = require("apollo-utilities");
function linkToFetcher(link) {
    return function (fetcherOperation) {
        var linkOperation = __assign({}, fetcherOperation, { query: graphql_1.parse(fetcherOperation.query) });
        return makePromise(execute(link, linkOperation));
    };
}
exports.default = linkToFetcher;
// Most code from below here is copied from apollo-link
// TODO - remove
function makePromise(observable) {
    var completed = false;
    return new Promise(function (resolve, reject) {
        observable.subscribe({
            next: function (data) {
                if (completed) {
                    console.warn("Promise Wrapper does not support multiple results from Observable");
                }
                else {
                    completed = true;
                    resolve(data);
                }
            },
            error: reject,
        });
    });
}
function execute(link, operation) {
    return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))));
}
function createOperation(starting, operation) {
    var context = __assign({}, starting);
    var setContext = function (next) {
        if (typeof next === 'function') {
            context = next(context);
        }
        else {
            context = __assign({}, next);
        }
    };
    var getContext = function () { return (__assign({}, context)); };
    Object.defineProperty(operation, 'setContext', {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, 'getContext', {
        enumerable: false,
        value: getContext,
    });
    Object.defineProperty(operation, 'toKey', {
        enumerable: false,
        value: function () { return getKey(operation); },
    });
    return operation;
}
function validateOperation(operation) {
    var OPERATION_FIELDS = [
        'query',
        'operationName',
        'variables',
        'extensions',
        'context',
    ];
    if (!operation.query) {
        throw new Error('ApolloLink requires a query');
    }
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw new Error("illegal argument: " + key);
        }
    }
    return operation;
}
function getKey(operation) {
    // XXX we're assuming here that variables will be serialized in the same order.
    // that might not always be true
    return graphql_1.print(operation.query) + "|" + JSON.stringify(operation.variables) + "|" + operation.operationName;
}
function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query,
    };
    // best guess at an operation name
    if (!transformedOperation.operationName) {
        transformedOperation.operationName =
            typeof transformedOperation.query !== 'string'
                ? apollo_utilities_1.getOperationName(transformedOperation.query)
                : '';
    }
    return transformedOperation;
}
//# sourceMappingURL=linkToFetcher.js.map