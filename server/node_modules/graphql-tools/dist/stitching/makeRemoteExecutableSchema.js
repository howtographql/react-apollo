"use strict";
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
var linkToFetcher_1 = require("./linkToFetcher");
var graphql_2 = require("graphql");
var isEmptyObject_1 = require("../isEmptyObject");
var schemaGenerator_1 = require("../schemaGenerator");
var resolveFromParentTypename_1 = require("./resolveFromParentTypename");
var defaultMergedResolver_1 = require("./defaultMergedResolver");
var errors_1 = require("./errors");
function makeRemoteExecutableSchema(_a) {
    var schema = _a.schema, link = _a.link, fetcher = _a.fetcher;
    if (!fetcher && link) {
        fetcher = linkToFetcher_1.default(link);
    }
    var queryType = schema.getQueryType();
    var queries = queryType.getFields();
    var queryResolvers = {};
    Object.keys(queries).forEach(function (key) {
        queryResolvers[key] = createResolver(fetcher);
    });
    var mutationResolvers = {};
    var mutationType = schema.getMutationType();
    if (mutationType) {
        var mutations = mutationType.getFields();
        Object.keys(mutations).forEach(function (key) {
            mutationResolvers[key] = createResolver(fetcher);
        });
    }
    var resolvers = (_b = {}, _b[queryType.name] = queryResolvers, _b);
    if (!isEmptyObject_1.default(mutationResolvers)) {
        resolvers[mutationType.name] = mutationResolvers;
    }
    var typeMap = schema.getTypeMap();
    var types = Object.keys(typeMap).map(function (name) { return typeMap[name]; });
    var _loop_1 = function (type) {
        if (type instanceof graphql_2.GraphQLInterfaceType ||
            type instanceof graphql_2.GraphQLUnionType) {
            resolvers[type.name] = {
                __resolveType: function (parent, context, info) {
                    return resolveFromParentTypename_1.default(parent, info.schema);
                },
            };
        }
        else if (type instanceof graphql_2.GraphQLScalarType) {
            if (!(type === graphql_2.GraphQLID ||
                type === graphql_2.GraphQLString ||
                type === graphql_2.GraphQLFloat ||
                type === graphql_2.GraphQLBoolean ||
                type === graphql_2.GraphQLInt)) {
                resolvers[type.name] = createPassThroughScalar(type);
            }
        }
        else if (type instanceof graphql_2.GraphQLObjectType &&
            type.name.slice(0, 2) !== '__' &&
            type !== queryType &&
            type !== mutationType) {
            var resolver_1 = {};
            Object.keys(type.getFields()).forEach(function (field) {
                resolver_1[field] = defaultMergedResolver_1.default;
            });
            resolvers[type.name] = resolver_1;
        }
    };
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var type = types_1[_i];
        _loop_1(type);
    }
    var typeDefs = graphql_1.printSchema(schema);
    return schemaGenerator_1.makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers,
    });
    var _b;
}
exports.default = makeRemoteExecutableSchema;
function createResolver(fetcher) {
    var _this = this;
    return function (root, args, context, info) { return __awaiter(_this, void 0, void 0, function () {
        var fragments, document, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fragments = Object.keys(info.fragments).map(function (fragment) { return info.fragments[fragment]; });
                    document = {
                        kind: graphql_1.Kind.DOCUMENT,
                        definitions: [info.operation].concat(fragments),
                    };
                    return [4 /*yield*/, fetcher({
                            query: graphql_2.print(document),
                            variables: info.variableValues,
                            context: { graphqlContext: context },
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, errors_1.checkResultAndHandleErrors(result, info)];
            }
        });
    }); };
}
function createPassThroughScalar(_a) {
    var name = _a.name, description = _a.description;
    return new graphql_2.GraphQLScalarType({
        name: name,
        description: description,
        serialize: function (value) {
            return value;
        },
        parseValue: function (value) {
            return value;
        },
        parseLiteral: function (ast) {
            return parseLiteral(ast);
        },
    });
}
function parseLiteral(ast) {
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN: {
            return ast.value;
        }
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT: {
            return parseFloat(ast.value);
        }
        case graphql_1.Kind.OBJECT: {
            var value_1 = Object.create(null);
            ast.fields.forEach(function (field) {
                value_1[field.name.value] = parseLiteral(field.value);
            });
            return value_1;
        }
        case graphql_1.Kind.LIST: {
            return ast.values.map(parseLiteral);
        }
        default:
            return null;
    }
}
//# sourceMappingURL=makeRemoteExecutableSchema.js.map