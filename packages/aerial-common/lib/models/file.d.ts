import { IBus } from "mesh";
import { Kernel } from "../ioc";
import { Observable } from "../observable";
export declare class File extends Observable {
    path: string;
    mtime: number;
    content: string;
    readonly type: string;
    private _watcher;
    protected _kernel: Kernel;
    protected _bus: IBus<any, any>;
    constructor();
    dispose(): void;
    save(): Promise<void>;
}
