import { DuplexStream, IStreamableBus } from "mesh";
export declare class UpsertBus implements IStreamableBus<any> {
    private _child;
    constructor(_child: IStreamableBus<any>);
    dispatch(request: any): DuplexStream<{}, {}>;
}
