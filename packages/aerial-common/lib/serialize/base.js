"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function createSerializer(ctor) {
    if (ctor.prototype.serialize) {
        return {
            serialize: function (value) {
                return value.serialize();
            },
            deserialize: function (value, kernel, ctor) {
                var instance = kernel && kernel.create(ctor, []) || new ctor();
                instance.deserialize(value);
                return instance;
            }
        };
    }
    return {
        serialize: function (value) {
            return JSON.parse(JSON.stringify(value));
        },
        deserialize: function (value, kernel, ctor) {
            var instance = new ctor();
            return Object.assign(instance, value);
        }
    };
}
exports.createSerializer = createSerializer;
var defaultSerializer = {
    serialize: function (value) {
        return value.serialize ? value.serialize() : JSON.parse(JSON.stringify(value));
    },
    deserialize: function (value, kernel, ctor) {
        var instance = kernel && kernel.create(ctor, []) || new ctor();
        return instance.deserialize ? instance.deserialize(value) : Object.assign(instance, value);
    }
};
var LITERAL_TYPE = "[[Literal]]";
var LiteralSerializer = (function () {
    function LiteralSerializer() {
    }
    LiteralSerializer.prototype.serialize = function (value) {
        return value;
    };
    LiteralSerializer.prototype.deserialize = function (value, ctor, kernel) {
        return value;
    };
    return LiteralSerializer;
}());
var _serializers = (_a = {},
    _a[LITERAL_TYPE] = { ctor: undefined, serializer: new LiteralSerializer() },
    _a.Array = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                // cast value as an array if it's not (might be a sub class)
                return ([].concat(value)).map(serialize);
            },
            deserialize: function (value, kernel) {
                return value.map(function (item) { return deserialize(item, kernel); });
            }
        }
    },
    _a.Date = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                return Date.now();
            },
            deserialize: function (value) {
                return new Date(value);
            }
        }
    },
    _a.RegExp = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                return { source: value.source, flags: value.flags };
            },
            deserialize: function (_a) {
                var source = _a.source, flags = _a.flags;
                return new RegExp(source, flags);
            }
        }
    },
    _a.Error = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                return { name: value.name, message: value.message, stack: value.stack };
            },
            deserialize: function (_a) {
                var name = _a.name, message = _a.message, stack = _a.stack;
                return { name: name, message: message, stack: stack };
            }
        }
    },
    _a.Object = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                var v = {};
                for (var k in value) {
                    v[k] = serialize(value[k]);
                }
                return v;
            },
            deserialize: function (value, kernel) {
                var v = {};
                for (var k in value) {
                    v[k] = deserialize(value[k], kernel);
                }
                return v;
                ;
            }
        }
    },
    _a.Buffer = {
        ctor: undefined,
        serializer: {
            serialize: function (value) {
                return value.toString("base64");
            },
            deserialize: function (value, kernel) {
                return new Buffer(value, "base64");
            }
        }
    },
    _a);
function getSerializeType(value) {
    return isSerializable(value) ? Reflect.getMetadata("serialize:type", value.constructor) || Reflect.getMetadata("serialize:type", value) : getNativeSerializeType(value);
}
exports.getSerializeType = getSerializeType;
function getNativeSerializeType(value) {
    // need to use instanceof since the value may be a sub class
    if (value instanceof Array)
        return "Array";
    if (value instanceof Date)
        return "Date";
    if (value instanceof RegExp)
        return "RegExp";
    if (value instanceof Error)
        return "Error";
    if (value instanceof Buffer)
        return "Buffer";
    if (value && value.constructor.name === "Object")
        return "Object";
    return undefined;
}
function serializable(type, serializer) {
    return function (ctor) {
        if (_serializers[type])
            throw new Error("Cannot override existing serializer \"" + type + "\".");
        // if serializer does not exist, then fetch from parent class serializer if it exists
        var parentSerializerInfo = _serializers[Reflect.getMetadata("serialize:type", ctor)];
        _serializers[type] = {
            ctor: ctor,
            serializer: serializer || (parentSerializerInfo ? parentSerializerInfo.serializer : createSerializer(ctor))
        };
        Reflect.defineMetadata("serialize:type", type, ctor);
    };
}
exports.serializable = serializable;
function isSerializable(value) {
    return !!value && (typeof value === "function" ? !!Reflect.getMetadata("serialize:type", value) : !!Reflect.getMetadata("serialize:type", value.constructor));
}
exports.isSerializable = isSerializable;
function serialize(value) {
    var type = getSerializeType(value) || LITERAL_TYPE;
    var data = [type, _serializers[type].serializer.serialize(value)];
    if (typeof value === "object" && value) {
        var metadataKeys = Reflect.getMetadataKeys(value);
        for (var i = 0, n = metadataKeys.length; i < n; i++) {
            data.push(metadataKeys[i], Reflect.getMetadata(metadataKeys[i], value));
        }
    }
    return data;
}
exports.serialize = serialize;
function deserialize(content, kernel) {
    var info = _serializers[content[0]];
    if (!info) {
        throw new Error("Trying to deserialize non serialized object:" + content);
    }
    var result = info.serializer.deserialize(content[1], kernel, info.ctor);
    var metadata = content.length > 2 ? content.slice(2) : [];
    for (var i = 0, n = metadata.length; i < n; i += 2) {
        Reflect.defineMetadata(metadata[i], metadata[i + 1], result);
    }
    return result;
}
exports.deserialize = deserialize;
var _a;
//# sourceMappingURL=base.js.map