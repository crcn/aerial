import { FileCache } from "../file-cache";
import { FileCacheProvider } from "../providers";
import { BaseCommand, inject } from "aerial-common";
import { UpdateFileCacheRequest } from "../messages";

export class UpdateFileCacheCommand extends BaseCommand {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  async execute({ uri, content, updatedAt }: UpdateFileCacheRequest) {
    const item = await this._fileCache.find(uri);
    if (!item) return;
    this.logger.info(`Updating file cache: ${uri}, mtime: ${updatedAt}`);
    if (content == null) {
      item.contentUri = item.sourceUri;
    } else {
      await item.setDataUrlContent(content);
    }
    item.contentUpdatedAt = updatedAt;
    await item.save();
  }
}