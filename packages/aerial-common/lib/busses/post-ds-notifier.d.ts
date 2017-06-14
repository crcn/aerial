import { IMessage, IBus, IStreamableBus, TransformStream } from "mesh";
export declare class PostDsNotifierBus implements IStreamableBus<any> {
    private _dsBus;
    private _dispatcher;
    constructor(_dsBus: IStreamableBus<any>, _dispatcher: IBus<any, any>);
    dispatch(message: IMessage): TransformStream<any, any>;
}
