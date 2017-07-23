// TODO - this is deprecated. Move to strategies/default

import fs =  require("fs");
import memoize =  require("memoizee");

import { IFileResolver } from "../resolver";
import { IBus, readOneChunk } from "mesh7";
import {
  inject,
  Logger,
  Kernel,
  loggable,
  KernelProvider,
  MimeTypeProvider,
  PrivateBusProvider,
} from "aerial-common";
import resolve =  require("resolve");
import pkgpath = require("package-path");


export interface IFileResolver {
  resolve(uri: string, origin?: string): Promise<string>;
}


export class NodeModuleResolver  {

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  constructor(readonly options: { extensions: string[], directories: string[] }) {

  }

  async resolve(relativePath: string, cwd?: string): Promise<string> {

    // do not resolve not file: protocols
    if (/\w+:\/\//.test(relativePath) && relativePath.indexOf("file:") !== 0) {
      return relativePath;
    }

    // quick fix -- cwd 
    if (cwd && cwd.indexOf("file:") !== 0) {
      return relativePath;
    }

    cwd = cwd && cwd.replace("file://", "");
    relativePath = relativePath.replace("file://", "");

    const { extensions, directories } = this.options;

    let modulesBaseDir = cwd;

    if (cwd) {
      const pkgPath = fs.existsSync(cwd + "/package.json") ? cwd : pkgpath.sync(cwd);

      const pkg = pkgPath && JSON.parse(fs.readFileSync(pkgPath + "/package.json", "utf8"));

      // check browser flag in package.json

	    if (!/^(\.|[\/\\]|(\w:\\))/.test(relativePath)) {
        modulesBaseDir = pkgPath;
      }


      if (pkg && pkg.browser && pkg.browser[relativePath] != null) {
        relativePath = pkg.browser[relativePath];
      }

      directories.push(modulesBaseDir + "/node_modules");

      if (<boolean><any>relativePath === false) return Promise.resolve(undefined);
    } else {
      modulesBaseDir = process.cwd();
    }

    // override resolve js functionality here -- directories here are
    // typically scanned in the beginning. We want to resolve from node_modules
    // after the target directories.
    directories.push(...modulesBaseDir.split("/").map((dir, index, parts) => {
      return parts.slice(0, index + 1).join("/") + "/node_modules";
    }), cwd);

    const resolvedPath = resolve.sync(relativePath, {
      basedir: modulesBaseDir,
      extensions: extensions,
      paths: directories.filter(dir => !!dir),

      // moduleDirectory is required, but it foos with
      // dependency resolution. Solution: give a directory that doesn't have anything
      moduleDirectory: "/i/should/not/exist",

      packageFilter: (pkg, uri) => {
        const main = (pkg.browser && typeof pkg.browser === "object" ? pkg.browser[pkg.main] : pkg.browser) || pkg.main;
        return {
          main: main
        }
      }
    });

    return "file://" + resolvedPath;
  }
}