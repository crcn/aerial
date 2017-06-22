import {Observable } from "../observable";
import { ICommand } from "../commands";
import { CoreEvent } from "../messages";
import { IBrokerBus } from "../busses";
import { ITyped, INamed } from "../object";
import { IBus, IMessage } from "mesh";

import {
  IFactory,
  Provider,
  Kernel,
  IProvider,
  ClassFactoryProvider,
 } from "./base";

// TODO - add more static find methods to each Provider here

export * from "./base";

/**
 */

export function createSingletonBusProviderClass(name: string): { getInstance(providers:Kernel): IBrokerBus, ID: string, new(bus: IBrokerBus): Provider<IBrokerBus> } {

  const id = ["bus", name].join("/");

  return class BusProvider extends Provider<IBrokerBus> {

    static readonly ID = id;

    constructor(bus: IBrokerBus) {
      super(id, bus);
    }

    static getInstance(providers: Kernel): IBrokerBus {
      const provider = providers.query<any>(id);
      if (!provider) {
        throw new Error(`Cannot get a singleton provider instance of "${id}"`);
      }
      return provider.value;
    }
  };
}

/**
 * Private bus that can only be used within the application. This typically contains messages
 * that are junk for other outside resources.
 *
 * Bubbles messages to the protected bus.
 */

export const PrivateBusProvider   = createSingletonBusProviderClass("private");


/**
 */

export class KernelProvider extends Provider<Kernel> {
  static ID = "providers";
  constructor() {
    super(KernelProvider.ID, null);
  }

  clone() {
    return new KernelProvider();
  }

  get owner(): Kernel {
    return this.value;
  }

  set owner(value: Kernel) {
    this.value = value;
  }
}

/**
 */

let i = 0;

export class CommandFactoryProvider extends ClassFactoryProvider {
  static readonly NS = "commands";
  readonly messageFilter: Function;
  constructor(messageFilter: string|Function, readonly clazz: { new(...rest: any[]): ICommand }, priority?: number) {
    super([CommandFactoryProvider.NS, i++].join("/"), clazz, priority);
    if (typeof messageFilter === "string") {
      this.messageFilter = (message: IMessage) => message.type === messageFilter;
    } else {
      this.messageFilter = messageFilter;
    }
  }
  create(): ICommand {
    return super.create();
  }
  static findAll(providers: Kernel) {
    return providers.queryAll<CommandFactoryProvider>([CommandFactoryProvider.NS, "**"].join("/"));
  }

  static findAllByMessage(message: IMessage, providers: Kernel): CommandFactoryProvider[] {
    return this.findAll(providers).filter((dep) => dep.messageFilter(message));
  }

  clone() {
    return new CommandFactoryProvider(this.messageFilter, this.clazz, this.priority);
  }
}

/**
 */

export class MimeTypeProvider extends Provider<string> {
  static readonly NS = "mimeType";
  constructor(readonly fileExtension: string, readonly mimeType: string) {
    super([MimeTypeProvider.NS, fileExtension].join("/"), mimeType);
  }
  clone() {
    return new MimeTypeProvider(this.fileExtension, this.mimeType);
  }
  static findAll(providers: Kernel) {
    return providers.queryAll<MimeTypeProvider>([MimeTypeProvider.NS, "**"].join("/"));
  }
  static lookup(uri: string, providers: Kernel): string {
    const extension = uri.split(".").pop();
    const dep = providers.query<MimeTypeProvider>([MimeTypeProvider.NS, extension].join("/"));
    return dep ? dep.value : undefined;
  }
}

export class MimeTypeAliasProvider extends Provider<string> {
  static readonly NS = "mimeTypeAliases";
  constructor(readonly mimeType: string, readonly aliasMimeType: string) {
    super(MimeTypeAliasProvider.getNamespace(mimeType), aliasMimeType);
  }
  clone() {
    return new MimeTypeAliasProvider(this.mimeType, this.aliasMimeType);
  }
  static getNamespace(mimeType: string) {
    return [MimeTypeAliasProvider.NS, mimeType].join("/");
  }
  static lookup(uriOrMimeType: string, providers: Kernel): string {
    const mimeType = MimeTypeProvider.lookup(uriOrMimeType, providers);
    const dep = (mimeType && providers.query<MimeTypeAliasProvider>(this.getNamespace(mimeType))) || providers.query<MimeTypeAliasProvider>(this.getNamespace(uriOrMimeType));
    return (dep && dep.value) || mimeType || uriOrMimeType;
  }
}

export class StoreProvider implements IProvider {

  static readonly NS = "store";
  private _value: Observable;
  readonly overridable = false;
  readonly id: string;
  public owner: Kernel;

  constructor(readonly name: string, private _clazz:{ new(): Observable }) {
    this.id = StoreProvider.getId(name);
  }
  
  get value() {
    return this._value || (this._value = new this._clazz());
  }

  clone() {
    return new StoreProvider(this.name, this._clazz);
  }

  static getId(name: string) {
    return [this.NS, name].join("/");
  }
}

export function createSingletonProviderClass<T>(id: string): { getInstance(kernel: Kernel): T, ID: string, new(clazz: { new(...rest): T }): IProvider } {
  return class SingletonProvider implements IProvider {
    static readonly ID: string = id;
    private _value: T;
    private _clazz: { new(...rest): T };
    readonly overridable = true;
    readonly id = id;
    public owner: Kernel;

    constructor(clazz: { new(...rest): T }) { this._clazz = clazz; }

    get value(): T {
      return this._value || (this._value = this.owner.create(this._clazz, []));
    }
    clone() {
      return new SingletonProvider(this._clazz);
    }
    static getInstance(kernel: Kernel): T {
      const dep = kernel.query<SingletonProvider>(id);
      return dep ? dep.value : undefined;
    }
  }
}


export class DSProvider extends Provider<IBus<any, any>> {
  static readonly ID: string = "ds";
  constructor(value: IBus<any, any>) {
    super(DSProvider.ID, value);
  }
}
