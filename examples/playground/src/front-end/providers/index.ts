import * as React from "react";
import { Provider, Kernel } from "aerial-common";

export class ComponentProvider extends Provider<React.ComponentClass<any>> {
  static readonly NS = "components";
  constructor(readonly name: string, value: React.ComponentClass<any>) {
    super(ComponentProvider.getId(name), value);
  }
  static getId(name: string) {
    return [this.NS, name].join("/");
  }
  create(props: any) {
    return React.createElement(this.value, props);
  }
  static findAll(name: string, kernel: Kernel) {
    return kernel.queryAll(this.getId(name));
  }
  static find(name: string, kernel: Kernel) {
    return kernel.query<ComponentProvider>(this.getId(name));
  }
  clone() {
    return new ComponentProvider(this.name, this.value);
  }
}

export class RootComponentProvider extends ComponentProvider {
  static readonly NAME = "root";
  constructor(value: React.ComponentClass<any>) {
    super(RootComponentProvider.NAME, value);
  }
  static create(props: any, kernel: Kernel) {
    return this.find(this.NAME, kernel).create(props);
  }
  clone() {
    return new RootComponentProvider(this.value);
  }
}
