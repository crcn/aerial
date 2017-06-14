import { SyntheticWindow } from "../window";
import { IStreamableBus, DuplexStream } from "mesh";
import { Logger } from "aerial-common";
import { HTTPRequest } from "./messages";
export declare class XHRServer implements IStreamableBus<HTTPRequest> {
    protected readonly logger: Logger;
    private _kernel;
    constructor(window: SyntheticWindow);
    dispatch(request: HTTPRequest): DuplexStream<{}, {}>;
}
