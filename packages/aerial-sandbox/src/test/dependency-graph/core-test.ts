import sinon =  require("sinon");
import { expect } from "chai";
import { Kernel, IProvider, MimeTypeProvider, Status } from "aerial-common";
import {
  Sandbox,
  SandboxModule,
  DependencyGraph,
  IDependencyLoader,
  createSandboxProviders,
  DependencyGraphProvider,
  ISandboxDependencyEvaluator,
  DependencyLoaderFactoryProvider,
  SandboxModuleEvaluatorFactoryProvider,
} from "../..";

import {
  IMockFiles,
  evaluateDependency,
  createTestDependencyGraph,
  createSandboxTestKernel,
  ISandboxTestProviderOptions,
} from "../../test";

describe(__filename + "#", () => {

  const createDefaultDependencyGraph = (mockFiles, providers?: IProvider[]) => {
    return createTestDependencyGraph({}, { mockFiles, providers });
  }

  it("loads files as plain text if there's no loader associated with them", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'hello world'
    });
    const entry = await graph.getDependency(await graph.resolve('entry.js', ''))
    await entry.load();
    expect(entry.type).to.equal("application/javascript");
    expect(entry.content).to.equal("hello world");
  });

  xit("doesn't reload a dependency during a middle of a load", async () => {
    // const graph = createDefaultDependencyGraph({
    //   'entry.js': 'hello world'
    // });

    // const entry = await graph.getDependency(await graph.resolve('entry.js', ''));
    // const loadInitialSourceContentSpy = sinon.spy(entry, "getInitialSourceContent");
    // entry.load();
    // await entry.load();
    // expect(loadInitialSourceContentSpy.callCount).to.eql(1);
  });

  it("reloads the dependency when the source file has changed", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'a'
    });

    const dependency = await graph.loadDependency(await graph.resolve('entry.js', ''));

    const fileCacheItem = await dependency.getSourceFileCacheItem();
    await fileCacheItem.setDataUrlContent("b");
    await fileCacheItem.save();
    await dependency.load();
    expect(dependency.content.toString()).to.equal("b");
  });

  it("reloads a dependency if the source file cache changes during a load", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.js': 'a'
    });

    const dependency = await graph.loadDependency(await graph.resolve('entry.js', ''));

    const fileCacheItem = await dependency.getSourceFileCacheItem();
    await fileCacheItem.setDataUrlContent("b");
    await fileCacheItem.save();
    dependency.load();
    await fileCacheItem.setDataUrlContent("c");
    fileCacheItem.save()
    expect(dependency.status.type).to.equal(Status.LOADING);

    // wait on the current load request
    await dependency.load();

    expect(dependency.content.toString()).to.equal("c");
  });

  xit("can return the dependency info of a dependency based on the relative path");
  xit("can return the dependency info of a dependency based on the absolute path");

  it("can use a custom loader & evaluator registered in the global kernel", async () => {
    const graph = createDefaultDependencyGraph({
      'entry.mu': `import(a.mu); import(b.mu);`,
      'a.mu': 'import(c.mu);',
      'b.mu': 'hello',
      'c.mu': 'world'
    }, [
      new MimeTypeProvider('mu', 'text/mu'),
      new DependencyLoaderFactoryProvider('text/mu', class implements IDependencyLoader {
        async load({ uri }, { type, content }) {
          return {
            type: "text/plain",
            content: content,
            importedDependencyUris: (content.match(/import\((.*?)\)/g) || []).map((expression) => {
              return expression.match(/\((.*?)\)/)[1];
            })
          }
        }
      }),
      new SandboxModuleEvaluatorFactoryProvider('text/plain', class implements ISandboxDependencyEvaluator {
        evaluate(module: SandboxModule) {
          module.exports = module.source.content.replace(/import\((.*?)\);?/g, (match: any, dependencyPath: any) => {
            return module.sandbox.evaluate(module.source.eagerGetDependency(dependencyPath)) as string;
          }).toUpperCase();
        }
      })
    ]);

    const entry = await graph.getDependency(await graph.resolve('entry.mu', ''));
    await entry.load();
    expect(await evaluateDependency(entry)).to.eql("WORLD HELLO");
  });
});