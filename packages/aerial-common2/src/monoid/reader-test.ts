import { expect } from "chai";
import { readAll } from "mesh";
import { reader, Reader } from "./reader";

describe(__filename + "#", () => {
  it("can be called", () => {
    expect(reader((v: number) => v + 1)(2)).to.eql(3);
  });

  it("can be chained together with andThen", () => {

    const fn = reader((v: number) => v + 1).andThen((v: number) => (
      -v
    ));

    expect(fn(10)).to.eql(-11);
  });

  it("can return a reader in andThen", () => {
    const fn = reader((v: number) => v + 1).andThen((v: number) => reader((v2) => -v * v2));
    expect(fn(10)).to.eql(-110);
  });

  it("can return a reader in a few andThens", () => {
    const fn = reader((a: string) => a + "b").andThen((b) => (a) => b + a + "c").andThen((c) => (a) => c + a + "d");
    expect(fn("a")).to.eql("abacad");
  });

  it("can handle promises", async () => {
    const fn = reader((v) => Promise.resolve(-v)).andThen((v) => v - 2);
    expect(await fn(3)).to.eql(-5);
  });


  it("can pipe an async iterable iterator into a mapped value", async () => {
    const negate = reader(async function*(n: number) {
      for (let i = n; i--;) {
        yield i;
      }
    }).andThen(readAll).andThen((v) => v.map((i) => -i));
    expect(await negate(5)).to.eql([-4, -3, -2, -1, -0]);
  });
  
});