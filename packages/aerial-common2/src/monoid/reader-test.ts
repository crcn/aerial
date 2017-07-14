import { expect } from "chai";
import { reader, Reader } from "./reader";

describe(__filename + "#", () => {
  it("can be called", () => {
    expect(reader((v: number) => v + 1)(2)).to.eql(3);
  });

  it("can be chained together with andThen", () => {

    // const findUser = (id: string) => reader(({db}) => db.findSync('users', { id: id }));

    // const removeUser = (id: string) => findUser(id).andThen((user) => {
    //   if (!user) throw new Error(`user not found`);
    //   return reader(db => db.removeSync('users', { id: user.id }));
    // });

    const fn = reader((v: number) => v + 1).andThen((v: number) => (
      -v
    ));

    expect(fn(10)).to.eql(-11);
  });

  it("can return a reader in andThen", () => {
    const fn = reader((v: number) => v + 1).andThen((v: number) => reader((v2) => -v * v2));

    expect(fn(10)).to.eql(-110);
  });
  
});