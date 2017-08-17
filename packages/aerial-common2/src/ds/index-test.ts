import { DataStore, DataStoreQuery, createDataStore, dsFind, dsFilter, dsIndex } from "./index";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can find a value", () => {
    const ds = createDataStore([{ name: "a" }, { name: "b" }]);
    const item = dsFind(ds, { name: "a" });
    expect(item.name).to.eql("a");
  });
  it("can find a value based on an index", () => {
    let ds = createDataStore([{ name: "a" }, { name: "b" }]);
    ds = dsIndex(ds, "name");
    const item = dsFind(ds, { name: "a" });
    expect(item.name).to.eql("a");
  });
});