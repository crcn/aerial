import { CoreEvent } from "../messages";
import { IObservable } from "./base";
import { IBus } from "mesh";
export declare class Observable implements IObservable {
    private _target;
    private _observers;
    constructor(_target?: IObservable);
    observe(...busses: IBus<any, any>[]): void;
    unobserve(...busses: IBus<any, any>[]): void;
    notify(event: CoreEvent): any;
}
