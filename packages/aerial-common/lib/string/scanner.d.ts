export declare class StringScanner {
    private _source;
    private _position;
    private _capture;
    constructor(source: any);
    scan(regexp: any): any;
    nextChar(): string;
    hasTerminated(): boolean;
    getCapture(): any;
}
