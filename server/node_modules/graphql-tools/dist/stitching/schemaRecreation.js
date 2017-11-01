"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var resolveFromParentTypename_1 = require("./resolveFromParentTypename");
var defaultMergedResolver_1 = require("./defaultMergedResolver");
function recreateCompositeType(schema, type, registry) {
    if (type instanceof graphql_1.GraphQLObjectType) {
        var fields_1 = type.getFields();
        var interfaces_1 = type.getInterfaces();
        return new graphql_1.GraphQLObjectType({
            name: type.name,
            description: type.description,
            isTypeOf: type.isTypeOf,
            fields: function () { return fieldMapToFieldConfigMap(fields_1, registry); },
            interfaces: function () { return interfaces_1.map(function (iface) { return registry.resolveType(iface); }); },
        });
    }
    else if (type instanceof graphql_1.GraphQLInterfaceType) {
        var fields_2 = type.getFields();
        return new graphql_1.GraphQLInterfaceType({
            name: type.name,
            description: type.description,
            fields: function () { return fieldMapToFieldConfigMap(fields_2, registry); },
            resolveType: function (parent, context, info) {
                return resolveFromParentTypename_1.default(parent, info.schema);
            },
        });
    }
    else if (type instanceof graphql_1.GraphQLUnionType) {
        return new graphql_1.GraphQLUnionType({
            name: type.name,
            description: type.description,
            types: function () {
                return type.getTypes().map(function (unionMember) { return registry.resolveType(unionMember); });
            },
            resolveType: function (parent, context, info) {
                return resolveFromParentTypename_1.default(parent, info.schema);
            },
        });
    }
    else if (type instanceof graphql_1.GraphQLInputObjectType) {
        return new graphql_1.GraphQLInputObjectType({
            name: type.name,
            description: type.description,
            fields: function () { return inputFieldMapToFieldConfigMap(type.getFields(), registry); },
        });
    }
    else {
        throw new Error("Invalid type " + type);
    }
}
exports.recreateCompositeType = recreateCompositeType;
function fieldMapToFieldConfigMap(fields, registry) {
    var result = {};
    Object.keys(fields).forEach(function (name) {
        result[name] = fieldToFieldConfig(fields[name], registry);
    });
    return result;
}
exports.fieldMapToFieldConfigMap = fieldMapToFieldConfigMap;
function fieldToFieldConfig(field, registry) {
    return {
        type: registry.resolveType(field.type),
        args: argsToFieldConfigArgumentMap(field.args, registry),
        resolve: defaultMergedResolver_1.default,
        description: field.description,
        deprecationReason: field.deprecationReason,
    };
}
function argsToFieldConfigArgumentMap(args, registry) {
    var result = {};
    args.forEach(function (arg) {
        var _a = argumentToArgumentConfig(arg, registry), name = _a[0], def = _a[1];
        result[name] = def;
    });
    return result;
}
function argumentToArgumentConfig(argument, registry) {
    return [
        argument.name,
        {
            type: registry.resolveType(argument.type),
            defaultValue: argument.defaultValue,
            description: argument.description,
        },
    ];
}
function inputFieldMapToFieldConfigMap(fields, registry) {
    var result = {};
    Object.keys(fields).forEach(function (name) {
        result[name] = inputFieldToFieldConfig(fields[name], registry);
    });
    return result;
}
function inputFieldToFieldConfig(field, registry) {
    return {
        type: registry.resolveType(field.type),
        description: field.description,
    };
}
//# sourceMappingURL=schemaRecreation.js.map