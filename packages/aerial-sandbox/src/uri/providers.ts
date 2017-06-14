import { URIProtocol } from "./protocol";
import { Kernel, createSingletonProviderClass, IProvider } from "aerial-common";

let _i = 0;

export class URIProtocolProvider implements IProvider {

  private _value: URIProtocol;
  readonly id: string;
  public owner: Kernel;
  readonly overridable: boolean = true;
  readonly test: (name:string) => boolean;

  constructor(test: string|((name:string) => boolean), readonly clazz: { new(): URIProtocol }, readonly priority?: number) {
    this.test = typeof test === "string" ? ((name) => name === test) : test;
    this.id = URIProtocolProvider.getId(String(_i++));
  }

  static getId(name: string) {
    return ["protocols", name].join("/");
  }

  clone() {
    return new URIProtocolProvider(this.test, this.clazz, this.priority);
  }

  get value() {
    return this._value || (this._value = this.owner.inject(new this.clazz())); 
  }

  static lookup(uri: string, kernel: Kernel) {

    // no protocol - it's a file
    if (uri.indexOf(":") === -1) {
      uri = "file://" + uri;
    }

    const protocolId = uri.split(":")[0];

    const provider = kernel.queryAll<URIProtocolProvider>(this.getId("**")).find((provider) => {
      return provider.test(protocolId);
    });

    return provider && provider.value;
  }
}



