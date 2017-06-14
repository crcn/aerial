export declare class SyntheticWindowTimers implements WindowTimers {
    private _timerIDs;
    setTimeout(callback: Function, timeout: number, ...args: any[]): number;
    setInterval(callback: Function, timeout: number, ...args: any[]): number;
    setImmediate(callback: Function, ...args: any[]): number;
    clearTimeout(timerID: any): void;
    clearInterval(timerID: any): void;
    clearImmediate(timerID: any): void;
    private clearTimer(timerID);
    dispose(): void;
}
