import { JS_MIME_TYPE } from "aerial-common";
import detective = require("detective");
import { IDependencyLoader, Dependency, IDependencyLoaderResult } from "aerial-sandbox";

export class CommonJSandboxLoader implements IDependencyLoader {
  constructor() {

  }

  async load(dependency: Dependency, { type, content }): Promise<IDependencyLoaderResult>  {
    content = String(content);
    const dependencies = detective(content);
    return {
      type: JS_MIME_TYPE,
      content: content,
      importedDependencyUris: dependencies
    };
  }
}