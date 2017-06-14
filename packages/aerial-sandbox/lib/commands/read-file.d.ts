import { ReadFileRequest } from "../messages";
import { BaseCommand } from "aerial-common";
import { IURIProtocolReadResult } from "../uri";
export declare class ReadFileCommand extends BaseCommand {
    execute({uri}: ReadFileRequest): Promise<IURIProtocolReadResult>;
}
