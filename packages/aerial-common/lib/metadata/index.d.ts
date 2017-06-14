import { Observable } from "../observable";
export declare class Metadata extends Observable {
    private _data;
    constructor(_data?: any);
    data: any;
    get(key: string): any;
    setProperties(properties: any): void;
    toggle(key: string): any;
    set(key: string, value: any): void;
}
