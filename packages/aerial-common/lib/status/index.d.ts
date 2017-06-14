export declare class Status {
    readonly type: string;
    readonly data: any;
    static readonly IDLE: string;
    static readonly ERROR: string;
    static readonly LOADING: string;
    static readonly COMPLETED: string;
    constructor(type: string, data?: any);
    clone(): Status;
}
