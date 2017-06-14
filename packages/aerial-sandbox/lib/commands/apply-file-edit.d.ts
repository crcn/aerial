import { BaseCommand } from "aerial-common";
import { ApplyFileEditRequest } from "../messages";
export declare class ApplyFileEditCommand extends BaseCommand {
    private _fileEditor;
    execute(request: ApplyFileEditRequest): Promise<any>;
}
