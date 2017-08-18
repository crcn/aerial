import { DataStore, DataStoreQuery, createDataStore, dsFind, dsFilter, dsIndex, dsRemove, dsUpdate, dsSplice, dsUpdateOne } from "./index";
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
    const items = dsFilter(ds, { name: "a" });
    console.log(items);
    expect(items.length).to.eql(1);
    expect(items[0].name).to.eql("a");
  });

  it("can query for multiple properties", () => {
    let ds = createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
    ds = dsIndex(ds, "a");
    const items = dsFilter(ds, { a: "b", c: "d"  });
    expect(items).to.eql([{ a: "b", c: "d" }]);
  });

  it("can query for multiple properties that are indexed", () => {
    let ds = createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
    ds = dsIndex(ds, "a");
    ds = dsIndex(ds, "c");
    const items = dsFilter(ds, { a: "b", c: "d"  });
    expect(items).to.eql([{ a: "b", c: "d" }]);
  });

  it("index a shared property", () => {
    let ds = createDataStore([{ a: "b", c: "e" }, { a: "b", c: "e" }, { a: "b3", c: "f" }]);
    ds = dsIndex(ds, "a", false);
    const items = dsFilter(ds, { a: "b", c: "e"  });
    expect(items).to.eql([{ a: "b", c: "e" }, { a: "b", c: "e" }]);
  });

  it("doesn't return a value if the rest of the query is not found", () => {
    let ds = createDataStore([{ a: "b", c: "e" }, { a: "b", c: "e" }, { a: "b3", c: "f" }]);
    ds = dsIndex(ds, "a", false);
    const items = dsFilter(ds, { a: "b", c: "d"  });
    expect(items).to.eql([]);
  });

  it("can remove a record", () => {
    let ds = createDataStore([{ a: "b", c: "d" }, { a: "b2", c: "e" }]);
    ds = dsIndex(ds, "a");
    ds = dsIndex(ds, "c");
    ds = dsRemove(ds, { a: "b" });
    expect(ds.records.length).to.eql(1);
  });

  it("can remove multiple records", () => {
    let ds = createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
    ds = dsIndex(ds, "a");
    ds = dsRemove(ds, { c: "e" });
    expect(ds.records.length).to.eql(1);
  });

  it("can update a record", () => {
    let ds = createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
    ds = dsIndex(ds, "a");
    ds = dsUpdate(ds, { c: "e" }, { c: "d" });
    expect(ds.records.length).to.eql(3);
    expect(ds.records[0].c).to.eql("d");
    expect(ds.records[1].c).to.eql("d");
  });

  it("can update one record", () => {
    let ds = createDataStore([{ a: "b", c: "e" }, { a: "b2", c: "e" }, { a: "b3", c: "f" }]);
    ds = dsIndex(ds, "a");
    ds = dsUpdateOne(ds, { c: "e" }, { c: "d" });
    expect(ds.records.length).to.eql(3);
    expect(ds.records[0].c).to.eql("d");
    expect(ds.records[1].c).to.eql("e");
  });

});