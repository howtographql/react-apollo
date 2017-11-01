"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var TypeRegistry = /** @class */ (function () {
    function TypeRegistry() {
        this.types = {};
        this.schemaByField = {
            query: {},
            mutation: {},
        };
        this.fragmentReplacements = {};
    }
    TypeRegistry.prototype.getSchemaByField = function (operation, fieldName) {
        return this.schemaByField[operation][fieldName];
    };
    TypeRegistry.prototype.getAllTypes = function () {
        var _this = this;
        return Object.keys(this.types).map(function (name) { return _this.types[name]; });
    };
    TypeRegistry.prototype.getType = function (name) {
        if (!this.types[name]) {
            throw new Error("No such type: " + name);
        }
        return this.types[name];
    };
    TypeRegistry.prototype.resolveType = function (type) {
        if (type instanceof graphql_1.GraphQLList) {
            return new graphql_1.GraphQLList(this.resolveType(type.ofType));
        }
        else if (type instanceof graphql_1.GraphQLNonNull) {
            return new graphql_1.GraphQLNonNull(this.resolveType(type.ofType));
        }
        else if (graphql_1.isNamedType(type)) {
            return this.getType(graphql_1.getNamedType(type).name);
        }
        else {
            return type;
        }
    };
    TypeRegistry.prototype.addSchema = function (schema) {
        var _this = this;
        var query = schema.getQueryType();
        if (query) {
            var fieldNames = Object.keys(query.getFields());
            fieldNames.forEach(function (field) {
                _this.schemaByField.query[field] = schema;
            });
        }
        var mutation = schema.getMutationType();
        if (mutation) {
            var fieldNames = Object.keys(mutation.getFields());
            fieldNames.forEach(function (field) {
                _this.schemaByField.mutation[field] = schema;
            });
        }
    };
    TypeRegistry.prototype.addType = function (name, type, onTypeConflict) {
        if (this.types[name]) {
            if (onTypeConflict) {
                type = onTypeConflict(this.types[name], type);
            }
            else {
                throw new Error("Type name conflict: " + name);
            }
        }
        this.types[name] = type;
    };
    TypeRegistry.prototype.addFragment = function (typeName, fieldName, fragment) {
        if (!this.fragmentReplacements[typeName]) {
            this.fragmentReplacements[typeName] = {};
        }
        this.fragmentReplacements[typeName][fieldName] = parseFragmentToInlineFragment(fragment);
    };
    return TypeRegistry;
}());
exports.default = TypeRegistry;
function parseFragmentToInlineFragment(definitions) {
    var document = graphql_1.parse(definitions);
    for (var _i = 0, _a = document.definitions; _i < _a.length; _i++) {
        var definition = _a[_i];
        if (definition.kind === graphql_1.Kind.FRAGMENT_DEFINITION) {
            return {
                kind: graphql_1.Kind.INLINE_FRAGMENT,
                typeCondition: definition.typeCondition,
                selectionSet: definition.selectionSet,
            };
        }
    }
    throw new Error('Could not parse fragment');
}
//# sourceMappingURL=TypeRegistry.js.map