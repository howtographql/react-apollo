"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var error_1 = require("graphql/error");
var errors_1 = require("./errors");
// Resolver that knows how to:
// a) handle aliases for proxied schemas
// b) handle errors from proxied schemas
var defaultMergedResolver = function (parent, args, context, info) {
    var responseKey = info.fieldNodes[0].alias
        ? info.fieldNodes[0].alias.value
        : info.fieldName;
    var errorResult = errors_1.getErrorsFromParent(parent, responseKey);
    if (errorResult.kind === 'OWN') {
        throw error_1.locatedError(errorResult.error.message, info.fieldNodes, graphql_1.responsePathAsArray(info.path));
    }
    else if (parent) {
        var result = parent[responseKey];
        if (errorResult.errors) {
            result = errors_1.annotateWithChildrenErrors(result, errorResult.errors);
        }
        return result;
    }
    else {
        return null;
    }
};
exports.default = defaultMergedResolver;
//# sourceMappingURL=defaultMergedResolver.js.map