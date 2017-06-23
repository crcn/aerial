import * as React from "react";
import { Component } from "../components/utils";
import { Provider, Kernel } from "aerial-common";

export class ComponentProvider extends Provider<Component<any>> {
  static readonly NS = "components";
  constructor(readonly name: string, value: Component<any>, subClass: typeof ComponentProvider = ComponentProvider) {
    super(subClass.getId(name), value);
  }
  static getId(name: string) {
    return [this.NS, name].join("/");
  }
  create(props: any) {
    return React.createElement(this.value as any, props);
  }
  static findAll(name: string, kernel: Kernel) {
    console.log(this.getId);
    return kernel.queryAll(this.getId(name));
  }
  static find(name: string, kernel: Kernel) {
    return kernel.query<ComponentProvider>(this.getId(name));
  }
  clone() {
    return new ComponentProvider(this.name, this.value);
  }
}

export function createComponentGroupProvider(ns: string, baseClass: typeof ComponentProvider = ComponentProvider) {
  class SubComponentProvider extends baseClass {
    static readonly SUB_NS = ns;
    constructor(name: string, value: Component<any>) {
      super(name, value, SubComponentProvider);
    }
    static getId(name: string) {
      return ComponentProvider.getId([ns, name].join("/"));
    }
    clone() {
      return new SubComponentProvider(this.name, this.value);
    }
  }
  return SubComponentProvider;
}

export function createComponentProvider(name: string, baseClass: typeof ComponentProvider = ComponentProvider) {
  class SubComponentProvider extends baseClass {
    static readonly NAME = name;
    constructor(value: Component<any>) {
      super(name, value);
    }
    static create(props: any, kernel: Kernel) {
      return this.find(name, kernel).create(props);
    }
    clone() {
      return new RootComponentProvider(this.value);
    }
  }
  return SubComponentProvider;
}

export class RootComponentProvider extends createComponentProvider("root") {
  constructor(value: Component<any>) {
    super(value);
  }
  static create(props: any, kernel: Kernel) {
    return this.find(this.NAME, kernel).create(props);
  }
  clone() {
    return new RootComponentProvider(this.value);
  }
}

export const EditorComponentProvider = createComponentGroupProvider("editorComponents");