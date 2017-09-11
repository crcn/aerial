// import path =  require("path");
// import sass = require("node-sass");
// import { inject, CSS_MIME_TYPE, isMaster, Queue } from "aerial-common";
// import { evaluateCSS, SyntheticWindow } from "aerial-synthetic-browser";
// import {
//   Dependency,
//   FileCache,
//   IFileResolver,
//   IDependencyLoader,
//   IDependencyLoaderResult,
//   FileCacheProvider,
//   FileResolverProvider,
// } from "aerial-sandbox";
// export class SCSSLoader implements IDependencyLoader {
//   @inject(FileCacheProvider.ID)
//   private _fileCache: FileCache;
//   @inject(FileResolverProvider.ID)
//   private _fileResolver: IFileResolver;
//   async load(uri, { type, content }): Promise<any> {
//     const importer = (url, prev, done) => {
//       new Promise(async (resolve) => {
//         const uri = await this._fileResolver.resolve(url, path.dirname(prev), {
//           // TODO: this should be left up to the resolver.
//           extensions: [".scss", ".css"],
//           directories: []
//         });
//         const content = await (await this._fileCache.item(uri)).read();
//         resolve(content);
//       }).then(done);
//     }
//     return new Promise((resolve, reject) => {
//       sass.render({
//         file: uri,
//         data: content,
//         importer: importer
//       }, (error, result) => {
//         if (error) return reject(error);
//         resolve({
//           type: CSS_MIME_TYPE,
//           map: JSON.stringify(result.map) as any,
//           content: result.css.toString()
//         } as IDependencyLoaderResult);
//       });
//     });
//   }
// }
//# sourceMappingURL=scss-loader.js.map