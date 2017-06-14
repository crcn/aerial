import { expect } from "chai";
import { createSandboxTestKernel } from "../../test/helpers";
import {
  FileCache,
  FileCacheProvider,
  URIProtocolProvider,
} from "../..";

import { PropertyMutation, MutationEvent } from "aerial-common";

describe(__filename + "#", () => {

  const createSandboxSingletons = (mockFiles) => {
    const kernel = createSandboxTestKernel({ mockFiles });
    return {
      fileCache: FileCacheProvider.getInstance(kernel),
      fileProtocol: URIProtocolProvider.lookup("file://", kernel),
    }
  }

  it("loads a file from the file system on request", async () => {
    const { fileCache } = createSandboxSingletons({
      "entry.js": "hello world"
    });

    const item = await fileCache.findOrInsert("entry.js");
    expect(await item.read()).to.eql({ type: "application/javascript", content: "hello world" });
  });

  it("caches loaded items", async () => {
    const { fileCache } = createSandboxSingletons({
      "entry.js": "a"
    });
    const item = await fileCache.findOrInsert("entry.js");
    expect(item).to.eql(await fileCache.find("entry.js"));
  });

  describe("file cache item#", () => {
    it("reloads the source file changes", async () => {
      const { fileProtocol, fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });

      const item = await fileCache.findOrInsert("entry.js");
      expect(await item.read()).to.eql({ type: "application/javascript", content: "a" });
      await fileProtocol.write("entry.js", "b");
      expect(await item.read()).to.eql({ type: "application/javascript", content: "b" });
    });

    it("emits a change when changing the data url", async () => {
      const { fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });
      const item = await fileCache.findOrInsert("entry.js");

      return new Promise(async (resolve) => {
        item.observe({
          dispatch({ mutation }: MutationEvent<any>) {
            if (mutation && mutation.type === PropertyMutation.PROPERTY_CHANGE) {
              expect(item.contentUri).to.equal("data:application/javascript,aGVsbG8=");
              resolve();
            }
          }
        });

        await item.setDataUrlContent("hello");
        item.save();
      });
    });

    it("emits a changes when the source file changes", async () => {
      const { fileProtocol, fileCache } = createSandboxSingletons({
        "entry.js": "a"
      });
      const item = await fileCache.findOrInsert("file://entry.js");
      const mtime = item.contentUpdatedAt;

      return new Promise((resolve) => {
        item.observe({
          dispatch({ mutation }: MutationEvent<any>) {
            if (mutation.type === PropertyMutation.PROPERTY_CHANGE) {
              expect(item.contentUri).to.equal("file://entry.js");
              expect(item.contentUpdatedAt).to.not.equal(mtime);
              resolve();
            }
          }
        });

        fileProtocol.write("entry.js", "b");
      });
    });
  });
});