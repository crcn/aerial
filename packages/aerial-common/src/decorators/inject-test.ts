import { inject } from "./inject";
import { expect } from "chai";
import { Kernel, ClassFactoryProvider, Provider, IInjectable } from "../ioc";

describe(__filename + "#", () => {
  it("can inject a simple string into a name prop", () => {
    class Person implements IInjectable {
      @inject("name")
      public name: string;
      $didInject() { }
    }

    const kernel = new Kernel(
      new Provider<string>("name", "bob"),
      new ClassFactoryProvider("person", Person)
    );

    const personDep = kernel.query<ClassFactoryProvider>("person");
    expect(personDep.create().name).to.equal("bob");
  });

  it("can map a dependency value before it's injected", () => {

    class Person implements IInjectable {
      @inject("name", dependency => dependency.value.toUpperCase())
      public name: string;
      $didInject() { }
    }

    const kernel = new Kernel(
      new Provider<string>("name", "bob"),
      new ClassFactoryProvider("person", Person)
    );

    const personDep = kernel.query<ClassFactoryProvider>("person");
    expect(personDep.create().name).to.equal("BOB");
  });

  it("can inject based on the property name", () => {
    class Person implements IInjectable {
      @inject()
      readonly name: string;
      $didInject() {

      }
    }
    const kernel = new Kernel(
      new Provider<string>("name", "joe"),
      new ClassFactoryProvider("person", Person)
    );

    const personDep = kernel.query<ClassFactoryProvider>("person");
    expect(personDep.create().name).to.equal("joe");
  });
});