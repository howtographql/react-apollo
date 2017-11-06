"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var TypeRegistry_1 = require("./TypeRegistry");
var isEmptyObject_1 = require("../isEmptyObject");
var schemaGenerator_1 = require("../schemaGenerator");
var schemaRecreation_1 = require("./schemaRecreation");
var typeFromAST_1 = require("./typeFromAST");
var errors_1 = require("./errors");
function defaultOnTypeConflict(left, right) {
    return left;
}
function mergeSchemas(_a) {
    var schemas = _a.schemas, onTypeConflict = _a.onTypeConflict, resolvers = _a.resolvers;
    if (!onTypeConflict) {
        onTypeConflict = defaultOnTypeConflict;
    }
    var queryFields = {};
    var mutationFields = {};
    var typeRegistry = new TypeRegistry_1.default();
    var mergeInfo = createMergeInfo(typeRegistry);
    var actualSchemas = [];
    var typeFragments = [];
    var extensions = [];
    var fullResolvers = {};
    schemas.forEach(function (schema) {
        if (schema instanceof graphql_1.GraphQLSchema) {
            actualSchemas.push(schema);
        }
        else if (typeof schema === 'string') {
            var parsedSchemaDocument = graphql_1.parse(schema);
            try {
                var actualSchema = graphql_1.buildASTSchema(parsedSchemaDocument);
                actualSchemas.push(actualSchema);
            }
            catch (e) {
                typeFragments.push(parsedSchemaDocument);
            }
            parsedSchemaDocument = schemaGenerator_1.extractExtensionDefinitions(parsedSchemaDocument);
            if (parsedSchemaDocument.definitions.length > 0) {
                extensions.push(parsedSchemaDocument);
            }
        }
    });
    actualSchemas.forEach(function (schema) {
        typeRegistry.addSchema(schema);
        var queryType = schema.getQueryType();
        var mutationType = schema.getMutationType();
        var typeMap = schema.getTypeMap();
        Object.keys(typeMap).forEach(function (typeName) {
            var type = typeMap[typeName];
            if (graphql_1.isNamedType(type) &&
                graphql_1.getNamedType(type).name.slice(0, 2) !== '__' &&
                type !== queryType &&
                type !== mutationType) {
                var newType = void 0;
                if (graphql_1.isCompositeType(type) || type instanceof graphql_1.GraphQLInputObjectType) {
                    newType = schemaRecreation_1.recreateCompositeType(schema, type, typeRegistry);
                }
                else {
                    newType = graphql_1.getNamedType(type);
                }
                typeRegistry.addType(newType.name, newType, onTypeConflict);
            }
        });
        Object.keys(queryType.getFields()).forEach(function (name) {
            if (!fullResolvers.Query) {
                fullResolvers.Query = {};
            }
            fullResolvers.Query[name] = createDelegatingResolver(mergeInfo, 'query', name);
        });
        queryFields = __assign({}, queryFields, queryType.getFields());
        if (mutationType) {
            if (!fullResolvers.Mutation) {
                fullResolvers.Mutation = {};
            }
            Object.keys(mutationType.getFields()).forEach(function (name) {
                fullResolvers.Mutation[name] = createDelegatingResolver(mergeInfo, 'mutation', name);
            });
            mutationFields = __assign({}, mutationFields, mutationType.getFields());
        }
    });
    typeFragments.forEach(function (document) {
        document.definitions.forEach(function (def) {
            var type = typeFromAST_1.default(typeRegistry, def);
            if (type) {
                typeRegistry.addType(type.name, type, onTypeConflict);
            }
        });
    });
    var passedResolvers = {};
    if (resolvers) {
        passedResolvers = resolvers(mergeInfo);
    }
    Object.keys(passedResolvers).forEach(function (typeName) {
        var type = passedResolvers[typeName];
        if (type instanceof graphql_1.GraphQLScalarType) {
            return;
        }
        Object.keys(type).forEach(function (fieldName) {
            var field = type[fieldName];
            if (field.fragment) {
                typeRegistry.addFragment(typeName, fieldName, field.fragment);
            }
        });
    });
    fullResolvers = mergeDeep(fullResolvers, passedResolvers);
    var query = new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: function () { return schemaRecreation_1.fieldMapToFieldConfigMap(queryFields, typeRegistry); },
    });
    var mutation;
    if (!isEmptyObject_1.default(mutationFields)) {
        mutation = new graphql_1.GraphQLObjectType({
            name: 'Mutation',
            fields: function () { return schemaRecreation_1.fieldMapToFieldConfigMap(mutationFields, typeRegistry); },
        });
    }
    typeRegistry.addType('Query', query);
    typeRegistry.addType('Mutation', mutation);
    var mergedSchema = new graphql_1.GraphQLSchema({
        query: query,
        mutation: mutation,
        types: typeRegistry.getAllTypes(),
    });
    extensions.forEach(function (extension) {
        mergedSchema = graphql_1.extendSchema(mergedSchema, extension);
    });
    schemaGenerator_1.addResolveFunctionsToSchema(mergedSchema, fullResolvers);
    return mergedSchema;
}
exports.default = mergeSchemas;
function createMergeInfo(typeRegistry) {
    return {
        delegate: function (operation, fieldName, args, context, info) {
            var schema = typeRegistry.getSchemaByField(operation, fieldName);
            if (!schema) {
                throw new Error("Cannot find subschema for root field " + operation + "." + fieldName);
            }
            var fragmentReplacements = typeRegistry.fragmentReplacements;
            return delegateToSchema(schema, fragmentReplacements, operation, fieldName, args, context, info);
        },
    };
}
function createDelegatingResolver(mergeInfo, operation, fieldName) {
    return function (root, args, context, info) {
        return mergeInfo.delegate(operation, fieldName, args, context, info);
    };
}
function delegateToSchema(schema, fragmentReplacements, operation, fieldName, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var type, graphqlDoc, operationDefinition, variableValues_1, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (operation === 'mutation') {
                        type = schema.getMutationType();
                    }
                    else {
                        type = schema.getQueryType();
                    }
                    if (!type) return [3 /*break*/, 2];
                    graphqlDoc = createDocument(schema, fragmentReplacements, type, fieldName, operation, info.fieldNodes, info.fragments, info.operation.variableDefinitions);
                    operationDefinition = graphqlDoc.definitions.find(function (_a) {
                        var kind = _a.kind;
                        return kind === graphql_1.Kind.OPERATION_DEFINITION;
                    });
                    variableValues_1 = {};
                    if (operationDefinition &&
                        operationDefinition.kind === graphql_1.Kind.OPERATION_DEFINITION &&
                        operationDefinition.variableDefinitions) {
                        operationDefinition.variableDefinitions.forEach(function (definition) {
                            var key = definition.variable.name.value;
                            // (XXX) This is kinda hacky
                            var actualKey = key;
                            if (actualKey.startsWith('_')) {
                                actualKey = actualKey.slice(1);
                            }
                            var value = args[actualKey] || args[key] || info.variableValues[key];
                            variableValues_1[key] = value;
                        });
                    }
                    return [4 /*yield*/, graphql_1.execute(schema, graphqlDoc, info.rootValue, context, variableValues_1)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, errors_1.checkResultAndHandleErrors(result, info, fieldName)];
                case 2: throw new Error('Could not forward to merged schema');
            }
        });
    });
}
function createDocument(schema, fragmentReplacements, type, rootFieldName, operation, selections, fragments, variableDefinitions) {
    var rootField = type.getFields()[rootFieldName];
    var newVariables = [];
    var rootSelectionSet = {
        kind: graphql_1.Kind.SELECTION_SET,
        // (XXX) This (wrongly) assumes only having one fieldNode
        selections: selections.map(function (selection) {
            if (selection.kind === graphql_1.Kind.FIELD) {
                var _a = processRootField(selection, rootFieldName, rootField), newSelection = _a.selection, variables = _a.variables;
                newVariables.push.apply(newVariables, variables);
                return newSelection;
            }
            else {
                return selection;
            }
        }),
    };
    var newVariableDefinitions = newVariables.map(function (_a) {
        var arg = _a.arg, variable = _a.variable;
        var argDef = rootField.args.find(function (rootArg) { return rootArg.name === arg; });
        if (!argDef) {
            throw new Error('Unexpected missing arg');
        }
        var typeName = typeToAst(argDef.type);
        return {
            kind: graphql_1.Kind.VARIABLE_DEFINITION,
            variable: {
                kind: graphql_1.Kind.VARIABLE,
                name: {
                    kind: graphql_1.Kind.NAME,
                    value: variable,
                },
            },
            type: typeName,
        };
    });
    var _a = filterSelectionSetDeep(schema, fragmentReplacements, type, rootSelectionSet, fragments), selectionSet = _a.selectionSet, processedFragments = _a.fragments, usedVariables = _a.usedVariables;
    var operationDefinition = {
        kind: graphql_1.Kind.OPERATION_DEFINITION,
        operation: operation,
        variableDefinitions: (variableDefinitions || []).filter(function (variableDefinition) {
            return usedVariables.indexOf(variableDefinition.variable.name.value) !== -1;
        }).concat(newVariableDefinitions),
        selectionSet: selectionSet,
    };
    var newDoc = {
        kind: graphql_1.Kind.DOCUMENT,
        definitions: [operationDefinition].concat(processedFragments),
    };
    return newDoc;
}
function processRootField(selection, rootFieldName, rootField) {
    var existingArguments = selection.arguments || [];
    var existingArgumentNames = existingArguments.map(function (arg) { return arg.name.value; });
    var allowedArguments = rootField.args.map(function (arg) { return arg.name; });
    var missingArgumentNames = difference(allowedArguments, existingArgumentNames);
    var extraArguments = difference(existingArgumentNames, allowedArguments);
    var filteredExistingArguments = existingArguments.filter(function (arg) { return extraArguments.indexOf(arg.name.value) === -1; });
    var variables = [];
    var missingArguments = missingArgumentNames.map(function (name) {
        // (XXX): really needs better var generation
        var variableName = "_" + name;
        variables.push({
            arg: name,
            variable: variableName,
        });
        return {
            kind: graphql_1.Kind.ARGUMENT,
            name: {
                kind: graphql_1.Kind.NAME,
                value: name,
            },
            value: {
                kind: graphql_1.Kind.VARIABLE,
                name: {
                    kind: graphql_1.Kind.NAME,
                    value: variableName,
                },
            },
        };
    });
    return {
        selection: {
            kind: graphql_1.Kind.FIELD,
            alias: null,
            arguments: filteredExistingArguments.concat(missingArguments),
            selectionSet: selection.selectionSet,
            name: {
                kind: graphql_1.Kind.NAME,
                value: rootFieldName,
            },
        },
        variables: variables,
    };
}
function filterSelectionSetDeep(schema, fragmentReplacements, type, selectionSet, fragments) {
    var validFragments = [];
    Object.keys(fragments).forEach(function (fragmentName) {
        var fragment = fragments[fragmentName];
        var typeName = fragment.typeCondition.name.value;
        var innerType = schema.getType(typeName);
        if (innerType) {
            validFragments.push(fragment);
        }
    });
    var _a = filterSelectionSet(schema, fragmentReplacements, type, selectionSet, validFragments), newSelectionSet = _a.selectionSet, remainingFragments = _a.usedFragments, usedVariables = _a.usedVariables;
    var newFragments = {};
    // (XXX): So this will break if we have a fragment that only has link fields
    while (remainingFragments.length > 0) {
        var name_1 = remainingFragments.pop();
        if (newFragments[name_1]) {
            continue;
        }
        else {
            var nextFragment = fragments[name_1];
            if (!name_1) {
                throw new Error("Could not find fragment " + name_1);
            }
            var typeName = nextFragment.typeCondition.name.value;
            var innerType = schema.getType(typeName);
            if (!innerType) {
                continue;
            }
            var _b = filterSelectionSet(schema, fragmentReplacements, innerType, nextFragment.selectionSet, validFragments), fragmentSelectionSet = _b.selectionSet, fragmentUsedFragments = _b.usedFragments, fragmentUsedVariables = _b.usedVariables;
            remainingFragments = union(remainingFragments, fragmentUsedFragments);
            usedVariables = union(usedVariables, fragmentUsedVariables);
            newFragments[name_1] = {
                kind: graphql_1.Kind.FRAGMENT_DEFINITION,
                name: {
                    kind: graphql_1.Kind.NAME,
                    value: name_1,
                },
                typeCondition: nextFragment.typeCondition,
                selectionSet: fragmentSelectionSet,
            };
        }
    }
    var newFragmentValues = Object.keys(newFragments).map(function (name) { return newFragments[name]; });
    return {
        selectionSet: newSelectionSet,
        fragments: newFragmentValues,
        usedVariables: usedVariables,
    };
}
function filterSelectionSet(schema, fragmentReplacements, type, selectionSet, validFragments) {
    var usedFragments = [];
    var usedVariables = [];
    var typeStack = [type];
    var filteredSelectionSet = graphql_1.visit(selectionSet, (_a = {},
        _a[graphql_1.Kind.FIELD] = {
            enter: function (node) {
                var parentType = resolveType(typeStack[typeStack.length - 1]);
                if (parentType instanceof graphql_1.GraphQLObjectType ||
                    parentType instanceof graphql_1.GraphQLInterfaceType) {
                    var fields = parentType.getFields();
                    var field = node.name.value === '__typename'
                        ? graphql_1.TypeNameMetaFieldDef
                        : fields[node.name.value];
                    if (!field) {
                        return null;
                    }
                    else {
                        typeStack.push(field.type);
                    }
                }
            },
            leave: function () {
                typeStack.pop();
            },
        },
        _a[graphql_1.Kind.SELECTION_SET] = function (node) {
            var parentType = resolveType(typeStack[typeStack.length - 1]);
            var parentTypeName = parentType.name;
            var selections = node.selections;
            if (parentType instanceof graphql_1.GraphQLInterfaceType ||
                parentType instanceof graphql_1.GraphQLUnionType) {
                selections = selections.concat({
                    kind: graphql_1.Kind.FIELD,
                    name: {
                        kind: graphql_1.Kind.NAME,
                        value: '__typename',
                    },
                });
            }
            if (fragmentReplacements[parentTypeName]) {
                selections.forEach(function (selection) {
                    if (selection.kind === graphql_1.Kind.FIELD) {
                        var name_2 = selection.name.value;
                        var fragment = fragmentReplacements[parentTypeName][name_2];
                        if (fragment) {
                            selections = selections.concat(fragment);
                        }
                    }
                });
            }
            if (selections !== node.selections) {
                return __assign({}, node, { selections: selections });
            }
        },
        _a[graphql_1.Kind.FRAGMENT_SPREAD] = function (node) {
            var fragmentFiltered = validFragments.filter(function (frg) { return frg.name.value === node.name.value; });
            var fragment = fragmentFiltered[0];
            if (fragment) {
                if (fragment.typeCondition) {
                    var innerType = schema.getType(fragment.typeCondition.name.value);
                    var parentType = resolveType(typeStack[typeStack.length - 1]);
                    if (!implementsAbstractType(parentType, innerType)) {
                        return null;
                    }
                }
                usedFragments.push(node.name.value);
                return;
            }
            else {
                return null;
            }
        },
        _a[graphql_1.Kind.INLINE_FRAGMENT] = {
            enter: function (node) {
                if (node.typeCondition) {
                    var innerType = schema.getType(node.typeCondition.name.value);
                    var parentType = resolveType(typeStack[typeStack.length - 1]);
                    if (implementsAbstractType(parentType, innerType)) {
                        typeStack.push(innerType);
                    }
                    else {
                        return null;
                    }
                }
            },
            leave: function (node) {
                if (node.typeCondition) {
                    var innerType = schema.getType(node.typeCondition.name.value);
                    if (innerType) {
                        typeStack.pop();
                    }
                    else {
                        return null;
                    }
                }
            },
        },
        _a[graphql_1.Kind.VARIABLE] = function (node) {
            usedVariables.push(node.name.value);
        },
        _a));
    return {
        selectionSet: filteredSelectionSet,
        usedFragments: usedFragments,
        usedVariables: usedVariables,
    };
    var _a;
}
function resolveType(type) {
    var lastType = type;
    while (lastType instanceof graphql_1.GraphQLNonNull ||
        lastType instanceof graphql_1.GraphQLList) {
        lastType = lastType.ofType;
    }
    return lastType;
}
function implementsAbstractType(parent, child, bail) {
    if (bail === void 0) { bail = false; }
    if (parent === child) {
        return true;
    }
    else if (parent instanceof graphql_1.GraphQLInterfaceType &&
        child instanceof graphql_1.GraphQLObjectType) {
        return child.getInterfaces().indexOf(parent) !== -1;
    }
    else if (parent instanceof graphql_1.GraphQLUnionType &&
        child instanceof graphql_1.GraphQLObjectType) {
        return parent.getTypes().indexOf(child) !== -1;
    }
    else if (parent instanceof graphql_1.GraphQLObjectType && !bail) {
        return implementsAbstractType(child, parent, true);
    }
    return false;
}
function typeToAst(type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        var innerType = typeToAst(type.ofType);
        if (innerType.kind === graphql_1.Kind.LIST_TYPE ||
            innerType.kind === graphql_1.Kind.NAMED_TYPE) {
            return {
                kind: graphql_1.Kind.NON_NULL_TYPE,
                type: innerType,
            };
        }
        else {
            throw new Error('Incorrent inner non-null type');
        }
    }
    else if (type instanceof graphql_1.GraphQLList) {
        return {
            kind: graphql_1.Kind.LIST_TYPE,
            type: typeToAst(type.ofType),
        };
    }
    else {
        return {
            kind: graphql_1.Kind.NAMED_TYPE,
            name: {
                kind: graphql_1.Kind.NAME,
                value: type.toString(),
            },
        };
    }
}
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function mergeDeep(target, source) {
    var output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(function (key) {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, (_a = {}, _a[key] = source[key], _a));
                }
                else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            }
            else {
                Object.assign(output, (_b = {}, _b[key] = source[key], _b));
            }
            var _a, _b;
        });
    }
    return output;
}
function union() {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    var cache = {};
    var result = [];
    arrays.forEach(function (array) {
        array.forEach(function (item) {
            if (!cache[item]) {
                cache[item] = true;
                result.push(item);
            }
        });
    });
    return result;
}
function difference(from) {
    var arrays = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        arrays[_i - 1] = arguments[_i];
    }
    var cache = {};
    arrays.forEach(function (array) {
        array.forEach(function (item) {
            cache[item] = true;
        });
    });
    return from.filter(function (item) { return !cache[item]; });
}
//# sourceMappingURL=mergeSchemas.js.map