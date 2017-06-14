export declare class CoreEvent {
    readonly type: string;
    readonly bubbles: boolean;
    private _target;
    private _currentTarget;
    private _canPropagate;
    private _canPropagateImmediately;
    constructor(type: string, bubbles?: boolean);
    currentTarget: any;
    readonly target: any;
    readonly canPropagate: boolean;
    readonly canPropagateImmediately: boolean;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
