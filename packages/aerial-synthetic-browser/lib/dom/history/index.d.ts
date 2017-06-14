import { Observable, PropertyWatcher } from "aerial-common";
import { SyntheticLocation } from "../../location";
export declare class SyntheticHistory extends Observable {
    $location: SyntheticLocation;
    $locationWatcher: PropertyWatcher<SyntheticHistory, SyntheticLocation>;
    private _states;
    private _index;
    constructor(url: string);
    readonly state: any;
    back(): void;
    forward(): void;
    go(index: any): void;
    readonly length: number;
    pushState(state: any, title: string, url: string): void;
    replaceState(state: any, title: string, url: string): void;
    private _redirect(url);
}
