import { Provider, IProvider, Kernel, IInjectable } from "../ioc";

// TODO - more kernel helpers here.

/**
 * inject decorator for properties of classes that live in a Kernel object
 */

// TODO - change this to injectProviderValue
export function inject(id?: string, map: (provider: IProvider) => any = undefined) {
  return function(target: any, property: any, index: any = undefined) {
    const key = typeof target === "function" ? index : property;
    const inject = Object.assign({}, Reflect.getMetadata("injectProperties", target) || {});
    inject[key] = [id || property, map || (provider => provider.value)];
    Reflect.defineMetadata("injectProperties", inject, target)
  }
}

export function injectProvider(id?: string) {
  return function(target: any, property: any, index: any = undefined) {
    const key = typeof target === "function" ? index : property;
    const inject = Object.assign({}, Reflect.getMetadata("injectProperties", target) || {});
    inject[key] = [id || property, provider => provider];
    Reflect.defineMetadata("injectProperties", inject, target)
  }
}

type injectableType = { new(...rest: any[]): Provider<any> }
