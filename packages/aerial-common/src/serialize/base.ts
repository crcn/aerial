import { Kernel } from "../ioc";

export type SerializedContentType<T> = any[];

export interface ISerializer<T, U> {
  serialize(value: T): U;
  deserialize(value: U, kernel: Kernel, ctor?: any): T;
}

export interface ISerializable<T> {
  serialize(): T;
  deserialize(value: T): void;
}

export function createSerializer(ctor: { new(...rest:any[]): any }): ISerializer<any, any> {

  if (ctor.prototype.serialize) {
    return {
      serialize(value: ISerializable<any>) {
        return value.serialize();
      },
      deserialize(value, kernel, ctor): ISerializable<any> {
        const instance: ISerializable<any> = kernel && kernel.create(ctor, []) || new ctor();
        instance.deserialize(value);
        return instance;
      }
    }
  }

  return {
    serialize(value): any {
      return JSON.parse(JSON.stringify(value));
    },
    deserialize(value, kernel, ctor) {
      const instance = new ctor();
      return Object.assign(instance, value);
    }
  }
}

const defaultSerializer: ISerializer<any, any> = {
  serialize(value): any {
    return value.serialize ? value.serialize() : JSON.parse(JSON.stringify(value));
  },
  deserialize(value, kernel, ctor) {
    const instance = kernel && kernel.create(ctor, []) || new ctor();
    return instance.deserialize ? instance.deserialize(value) : Object.assign(instance, value);
  }
}

const LITERAL_TYPE = "[[Literal]]";

class LiteralSerializer implements ISerializer<any, any> {
  serialize(value) {
    return value;
  }
  deserialize(value, ctor, kernel) {
    return value;
  }
}

interface ISerializerInfo {
  ctor: any;
  serializer: ISerializer<any, any>;
}

const _serializers   = {
  [LITERAL_TYPE]: { ctor: undefined, serializer: new LiteralSerializer() },
  Array: {
    ctor: undefined,
    serializer: {
      serialize(value: any[]) {

        // cast value as an array if it's not (might be a sub class)
        return ([].concat(value)).map(serialize);
      },
      deserialize(value: any[], kernel) {
        return value.map(item => deserialize(item, kernel));
      }
    }
  },
  Date: {
    ctor: undefined,
    serializer: {
      serialize(value: Date) {
        return Date.now();
      },
      deserialize(value: number) {
        return new Date(value);
      }
    }
  },
  RegExp: {
    ctor: undefined,
    serializer: {
      serialize(value: RegExp) {
        return { source: value.source, flags: value.flags };
      },
      deserialize({ source, flags }: any) {
        return new RegExp(source, flags);
      }
    }
  },
  Error: {
    ctor: undefined,
    serializer: {
      serialize(value: Error) {
        return { name: value.name, message: value.message, stack: value.stack };
      },
      deserialize({ name, message, stack }: any) {
        return { name, message, stack };
      }
    }
  },
  Object: {
    ctor: undefined,
    serializer: {
      serialize(value: Object) {
        const v = {};
        for (const k in value) {
          v[k] = serialize(value[k]);
        }
        return v;
      },
      deserialize(value, kernel) {
        const v = {};
        for (const k in value) {
          v[k] = deserialize(value[k], kernel);
        }
        return v;;
      }
    }
  },
  Buffer: {
    ctor: undefined,
    serializer: {
      serialize(value: Buffer) {
        return value.toString("base64");
      },
      deserialize(value, kernel) {
        return new Buffer(value, "base64");
      }
    }
  }
};

export function getSerializeType(value: any) {
   return isSerializable(value) ? Reflect.getMetadata("serialize:type", value.constructor) || Reflect.getMetadata("serialize:type", value) : getNativeSerializeType(value);
}

function getNativeSerializeType(value: any) {

  // need to use instanceof since the value may be a sub class
  if (value instanceof Array) return "Array";
  if (value instanceof Date) return "Date";
  if (value instanceof RegExp) return "RegExp";
  if (value instanceof Error) return "Error";
  if (value instanceof Buffer) return "Buffer";
  if (value && value.constructor.name === "Object") return "Object";

  return undefined;
}

export function serializable(type: string, serializer?: ISerializer<any, any>) {
  return function(ctor: { new(...rest:any[]): any }) {
    if (_serializers[type]) throw new Error(`Cannot override existing serializer "${type}".`);
    
    // if serializer does not exist, then fetch from parent class serializer if it exists
    const parentSerializerInfo = _serializers[Reflect.getMetadata(`serialize:type`, ctor)];

    _serializers[type] = {
      ctor: ctor,
      serializer: serializer || (parentSerializerInfo ? parentSerializerInfo.serializer : createSerializer(ctor))
    };

    Reflect.defineMetadata("serialize:type", type, ctor);
  }
}

export function isSerializable(value: Object) {
  return !!value && (typeof value === "function" ? !!Reflect.getMetadata("serialize:type", value) : !!Reflect.getMetadata("serialize:type", value.constructor));
}

export function serialize(value: any): SerializedContentType<any> {
  const type = getSerializeType(value) || LITERAL_TYPE;
  const data = [type, (<ISerializer<any, any>>_serializers[type].serializer).serialize(value)];
  
  if (typeof value === "object" && value) {
    const metadataKeys = Reflect.getMetadataKeys(value);
    for (let i = 0, n = metadataKeys.length; i < n; i++) {
      data.push(metadataKeys[i], Reflect.getMetadata(metadataKeys[i], value));
    }
  }
  
  return data;
}

export function deserialize(content: SerializedContentType<any>, kernel: Kernel): any {
  const info: ISerializerInfo = _serializers[content[0]];

  if (!info) {
    throw new Error(`Trying to deserialize non serialized object:` + content);
  }

  const result = info.serializer.deserialize(content[1], kernel, info.ctor);

  const metadata = content.length > 2 ? content.slice(2) : [];
  for (let i = 0, n = metadata.length; i < n; i += 2) {
    Reflect.defineMetadata(metadata[i], metadata[i + 1], result);
  }

  return result;
}
