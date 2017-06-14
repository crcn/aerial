export declare class Queue {
    private _items;
    private _running;
    constructor();
    add(callback: () => Promise<any>): Promise<{}>;
}
