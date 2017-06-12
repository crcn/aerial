import { expect } from "chai";
import {
  Provider,
  Kernel,
} from "./base";


describe(__filename + "#", () => {
  describe("Kernel#", () => {
    it("can be created", () => {
      new Kernel();
    });

    class UndefinedProvider extends Provider<string> {
      constructor(ns: string) {
        super(ns, undefined);
      }
    }

    it("can query for a fragment", () => {
      const ab = new Provider<string>("a/b", undefined);
      const deps = new Kernel(ab, new Provider<string>("c/d", undefined));
      expect(deps.query("a/b")).not.to.equal(undefined);
    });

    it("registers deps when calling register()", () => {
      const deps = new Kernel();
      const ab = new Provider<string>("a/b", "a");
      deps.register(ab);
      expect(deps.query("a/b")).not.to.equal(undefined);
    });


    it("can query for multiple deps that share the same path", () => {
      const deps = new Kernel(
        new UndefinedProvider("a/b"),
        new UndefinedProvider("a/c"),
        new UndefinedProvider("a/d"),
        new UndefinedProvider("a/d/e"),
        new UndefinedProvider("a/d/f"),
        new UndefinedProvider("b/c"),
        new UndefinedProvider("b")
      );

      expect(deps.queryAll("a/**").length).to.equal(5);
      expect(deps.queryAll("a/d/**").length).to.equal(2); // a/d/e, a/d/f
      expect(deps.queryAll("/**").length).to.equal(deps.length);
    });

    it("can create a child fragment with the same deps", () => {
      const deps = new Kernel(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"));
      const child = deps.clone();
      expect(child.length).to.equal(deps.length);
    });

    it("can register multiple deps via register()", () => {
      const deps = new Kernel();
      deps.register(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"));
      expect(deps.length).to.equal(2);
    });

    it("can register nested deps", () => {
      const deps = new Kernel();
      let de;
      deps.register(new UndefinedProvider("a/b"), new UndefinedProvider("b/c"), [new UndefinedProvider("b/d"), [de = new UndefinedProvider("d/e")]]);
      expect(deps.length).to.equal(4);
      expect(deps.query("d/e")).not.to.equal(undefined);
    });
  });
});