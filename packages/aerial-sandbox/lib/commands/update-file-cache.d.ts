import { BaseCommand } from "aerial-common";
import { UpdateFileCacheRequest } from "../messages";
export declare class UpdateFileCacheCommand extends BaseCommand {
    private _fileCache;
    execute({uri, content, updatedAt}: UpdateFileCacheRequest): Promise<void>;
}
