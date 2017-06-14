import { CoreEvent } from "../messages";
import { IStreamableBus, DuplexStream } from "mesh";
export declare class LimitBus implements IStreamableBus<any> {
    readonly max: number;
    readonly actor: IStreamableBus<any>;
    private _queue;
    private _running;
    constructor(max: number, actor: IStreamableBus<any>);
    dispatch(message: CoreEvent): DuplexStream<{}, {}>;
}
