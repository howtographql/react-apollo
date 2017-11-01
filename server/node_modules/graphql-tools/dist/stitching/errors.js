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
var error_1 = require("graphql/error");
var ERROR_SYMBOL = Symbol('subSchemaErrors');
function annotateWithChildrenErrors(object, childrenErrors) {
    if (childrenErrors && childrenErrors.length > 0) {
        if (Array.isArray(object)) {
            var byIndex_1 = {};
            childrenErrors.forEach(function (error) {
                var index = error.path[1];
                var current = byIndex_1[index] || [];
                current.push(__assign({}, error, { path: error.path.slice(1) }));
                byIndex_1[index] = current;
            });
            return object.map(function (item, index) {
                return annotateWithChildrenErrors(item, byIndex_1[index]);
            });
        }
        else {
            return __assign({}, object, (_a = {}, _a[ERROR_SYMBOL] = childrenErrors.map(function (error) { return (__assign({}, error, { path: error.path.slice(1) })); }), _a));
        }
    }
    else {
        return object;
    }
    var _a;
}
exports.annotateWithChildrenErrors = annotateWithChildrenErrors;
function getErrorsFromParent(object, fieldName) {
    var errors = (object && object[ERROR_SYMBOL]) || [];
    var childrenErrors = [];
    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
        var error = errors_1[_i];
        if (error.path.length === 1 && error.path[0] === fieldName) {
            return {
                kind: 'OWN',
                error: error,
            };
        }
        else if (error.path[0] === fieldName) {
            childrenErrors.push(error);
        }
    }
    return {
        kind: 'CHILDREN',
        errors: childrenErrors,
    };
}
exports.getErrorsFromParent = getErrorsFromParent;
function checkResultAndHandleErrors(result, info, responseKey) {
    if (!responseKey) {
        responseKey = info.fieldNodes[0].alias
            ? info.fieldNodes[0].alias.value
            : info.fieldName;
    }
    if (result.errors && (!result.data || result.data[responseKey] == null)) {
        var errorMessage = result.errors
            .map(function (error) { return error.message; })
            .join('\n');
        throw error_1.locatedError(errorMessage, info.fieldNodes, graphql_1.responsePathAsArray(info.path));
    }
    else {
        var resultObject = result.data[responseKey];
        if (result.errors) {
            resultObject = annotateWithChildrenErrors(resultObject, result.errors);
        }
        return resultObject;
    }
}
exports.checkResultAndHandleErrors = checkResultAndHandleErrors;
//# sourceMappingURL=errors.js.map