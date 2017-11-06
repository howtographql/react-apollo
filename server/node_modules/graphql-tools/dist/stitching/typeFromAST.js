"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var buildASTSchema_1 = require("graphql/utilities/buildASTSchema");
var resolveFromParentTypename_1 = require("./resolveFromParentTypename");
function typeFromAST(typeRegistry, node) {
    switch (node.kind) {
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
            return makeObjectType(typeRegistry, node);
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
            return makeInterfaceType(typeRegistry, node);
        case graphql_1.Kind.ENUM_TYPE_DEFINITION:
            return makeEnumType(typeRegistry, node);
        case graphql_1.Kind.UNION_TYPE_DEFINITION:
            return makeUnionType(typeRegistry, node);
        case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
            return makeScalarType(typeRegistry, node);
        case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
            return makeInputObjectType(typeRegistry, node);
        default:
            return null;
    }
}
exports.default = typeFromAST;
function makeObjectType(typeRegistry, node) {
    return new graphql_1.GraphQLObjectType({
        name: node.name.value,
        fields: function () { return makeFields(typeRegistry, node.fields); },
        interfaces: function () {
            return node.interfaces.map(function (iface) { return typeRegistry.getType(iface.name.value); });
        },
        description: buildASTSchema_1.getDescription(node),
    });
}
function makeInterfaceType(typeRegistry, node) {
    return new graphql_1.GraphQLInterfaceType({
        name: node.name.value,
        fields: function () { return makeFields(typeRegistry, node.fields); },
        description: buildASTSchema_1.getDescription(node),
        resolveType: function (parent, context, info) {
            return resolveFromParentTypename_1.default(parent, info.schema);
        },
    });
}
function makeEnumType(typeRegistry, node) {
    var values = {};
    node.values.forEach(function (value) {
        values[value.name.value] = {
            description: buildASTSchema_1.getDescription(value),
        };
    });
    return new graphql_1.GraphQLEnumType({
        name: node.name.value,
        values: values,
        description: buildASTSchema_1.getDescription(node),
    });
}
function makeUnionType(typeRegistry, node) {
    return new graphql_1.GraphQLUnionType({
        name: node.name.value,
        types: function () {
            return node.types.map(function (type) { return resolveType(typeRegistry, type); });
        },
        description: buildASTSchema_1.getDescription(node),
        resolveType: function (parent, context, info) {
            return resolveFromParentTypename_1.default(parent, info.schema);
        },
    });
}
function makeScalarType(typeRegistry, node) {
    return new graphql_1.GraphQLScalarType({
        name: node.name.value,
        description: buildASTSchema_1.getDescription(node),
        serialize: function () { return null; },
        // Note: validation calls the parse functions to determine if a
        // literal value is correct. Returning null would cause use of custom
        // scalars to always fail validation. Returning false causes them to
        // always pass validation.
        parseValue: function () { return false; },
        parseLiteral: function () { return false; },
    });
}
function makeInputObjectType(typeRegistry, node) {
    return new graphql_1.GraphQLInputObjectType({
        name: node.name.value,
        fields: function () { return makeValues(typeRegistry, node.fields); },
        description: buildASTSchema_1.getDescription(node),
    });
}
function makeFields(typeRegistry, nodes) {
    var result = {};
    nodes.forEach(function (node) {
        result[node.name.value] = {
            type: resolveType(typeRegistry, node.type),
            args: makeValues(typeRegistry, node.arguments),
            description: buildASTSchema_1.getDescription(node),
        };
    });
    return result;
}
function makeValues(typeRegistry, nodes) {
    var result = {};
    nodes.forEach(function (node) {
        var type = resolveType(typeRegistry, node.type);
        result[node.name.value] = {
            type: type,
            defaultValue: graphql_1.valueFromAST(node.defaultValue, type),
            description: buildASTSchema_1.getDescription(node),
        };
    });
    return result;
}
function resolveType(typeRegistry, node) {
    switch (node.kind) {
        case graphql_1.Kind.LIST_TYPE:
            return new graphql_1.GraphQLList(resolveType(typeRegistry, node.type));
        case graphql_1.Kind.NON_NULL_TYPE:
            return new graphql_1.GraphQLNonNull(resolveType(typeRegistry, node.type));
        default:
            return typeRegistry.getType(node.name.value);
    }
}
//# sourceMappingURL=typeFromAST.js.map