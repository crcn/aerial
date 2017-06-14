import { expect } from "chai";
import sinon =  require("sinon");
import { Sandbox, DependencyGraphProvider } from "../..";
import { createSandboxTestKernel, timeout } from "../../test/helpers";

describe(__filename + "#", () => {
  xit("can evaluate an entry", async () => {
    const kernel = createSandboxTestKernel({
      mockFiles: {
        "a.js": "module.exports = require('./b.js')",
        "b.js": "module.exports = 'bb';"
      }
    });

    const sandbox = new Sandbox(kernel);
    const graph = DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
    const dep = await graph.getDependency(await graph.resolve("a.js",""));
    await sandbox.open(dep);
    expect(sandbox.exports).to.equal("bb");
  });


  xit("re-evaluates a dependency if it changes", async () => {
    const kernel = createSandboxTestKernel({
      mockFiles: {
        "a.js": "module.exports = require('./b.js')",
        "b.js": "module.exports = 'bb';"
      }
    })

    const sandbox = new Sandbox(kernel);
    const graph = DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
    const dep = await graph.getDependency(await graph.resolve("a.js",""));
    await sandbox.open(dep);
    expect(sandbox.exports).to.equal("bb");
    await (await (await dep.getSourceFileCacheItem()).setDataUrlContent("module.exports = 'aa'")).save();
    await timeout(10);
    expect(sandbox.exports).to.equal("aa");
  });

  xit("re-evaluates once if multiple dependencies change at the same time", async () => {
    const kernel = createSandboxTestKernel({
      mockFiles: {
        "a.js": "module.exports = require('./b.js')",
        "b.js": "module.exports = require('./c.js');",
        "c.js": "module.exports = 'cc';"
      }
    });

    const sandbox = new Sandbox(kernel);
    const spy = sinon.spy(sandbox, "reset");
    const graph = DependencyGraphProvider.getInstance({ name: "webpack" }, kernel);
    const dep = await graph.getDependency(await graph.resolve("a.js",""));
    await sandbox.open(dep);
    expect(sandbox.exports).to.equal("cc");

    const bdep = dep.eagerGetDependency("b.js");
    const cdep = bdep.eagerGetDependency("c.js");

    await Promise.all([
      (await (await bdep.getSourceFileCacheItem()).setDataUrlContent("module.exports = require('./c.js') + 'b'")).save(),
      (await ((await cdep.getSourceFileCacheItem()).setDataUrlContent("module.exports = 'ccc'"))).save()
    ]);

    await timeout(10);

    expect(sandbox.exports).to.equal("cccb");
  });
});