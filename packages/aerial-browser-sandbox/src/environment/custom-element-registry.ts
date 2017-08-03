import { weakMemo } from "aerial-common2";
export const getSEnvCustomElementRegistry = weakMemo((options) => {
  return class SEnvCustomElementRegistry implements CustomElementRegistry {

    private _definedPromises: {
      [identifier: string]: Promise<void>
    };

    private _definedPromiseResolvers: {
      [identifier: string]: () => void
    };

    private _registry: {
      [identifier: string]: Function
    };

    constructor(private _window: Window) {
      this._registry = {};
      
      this._definedPromises = {};
      this._definedPromiseResolvers = {};
    }

    define(name: string, constructor: Function, options?: ElementDefinitionOptions) {

      // TODO - throw error if already registered
      this._registry[name] = constructor;
      constructor.prototype.ownerDocument = this._window.document;
      constructor.prototype.tagName = name.toUpperCase();
      if (this._definedPromiseResolvers[name]) {
        this._definedPromiseResolvers[name]();
      }
    }

    get(name: string) {
      return this._registry[name];
    }

    whenDefined(name: string) {
      if (this._registry[name]) return Promise.resolve();
      return this._definedPromises[name] || (this._definedPromises[name] = new Promise((resolve) => {
        this._definedPromiseResolvers[name] = () => {
          this._definedPromises[name] = this._definedPromiseResolvers[name] = undefined;
          resolve();
        }
      }));
    }
  }
});