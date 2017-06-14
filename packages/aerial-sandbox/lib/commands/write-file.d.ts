import { BaseCommand } from "aerial-common";
import { WriteFileRequest } from "../messages";
export declare class WriteFileCommand extends BaseCommand {
    execute({uri, content, options}: WriteFileRequest): Promise<any>;
}
