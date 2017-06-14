import { CoreEvent } from "../messages";
import { IBus } from "mesh";
import { IObservable } from "../observable";
export declare class BubbleDispatcher implements IBus<any, any> {
    readonly target: IObservable;
    constructor(target: IObservable);
    dispatch(event: CoreEvent): void;
}
