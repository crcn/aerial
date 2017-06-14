import { IObservable } from "./base";
import { Observable } from "./core";
import { MutationEvent } from "../messages";
export declare type propertyChangeCallbackType = (newValue: any, oldValue: any) => void;
export declare class PropertyWatcher<T extends IObservable, U> extends Observable {
    readonly target: T;
    readonly propertyName: string;
    private _currentValue;
    private _observer;
    private _listening;
    constructor(target: T, propertyName: string);
    readonly currentValue: U;
    connect(listener: (newValue: U, oldValue?: U) => any): {
        trigger(): any;
        dispose: () => void;
    };
    connectToProperty(target: any, property: string): {
        trigger(): any;
        dispose: () => void;
    };
    onEvent: ({mutation}: MutationEvent<any>) => void;
}
export declare function watchProperty(target: any, property: string, callback: propertyChangeCallbackType): {
    dispose: () => void;
    trigger: () => any;
};
export declare function watchPropertyOnce(target: any, property: string, callback: propertyChangeCallbackType): {
    dispose: () => void;
    trigger: () => {
        dispose: () => void;
        trigger: () => any;
    };
};
export declare function bindProperty(source: IObservable, sourceProperty: string, target: any, destProperty?: string): {
    dispose: () => void;
    trigger: () => any;
};
export declare function waitForPropertyChange(target: IObservable, property: string, filter?: (value) => boolean): Promise<{}>;
