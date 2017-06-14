import { IBus } from "mesh";
import { LogLevel } from "./levels";
import { CoreEvent } from "../messages";
export declare class LogEvent extends CoreEvent {
    readonly level: number;
    readonly text: string;
    readonly filterable: boolean;
    static readonly LOG: string;
    constructor(level: number, text: string, filterable?: boolean);
}
export declare class LogTimer {
    readonly logger: Logger;
    readonly intervalMessage: string;
    readonly timeout: number;
    level: LogLevel;
    private _startTime;
    private _interval;
    constructor(logger: Logger, intervalMessage?: string, timeout?: number, level?: LogLevel);
    stop(message?: string): void;
    private logTime(message);
}
export declare class Logger {
    bus: IBus<any, any>;
    prefix: string;
    private _parent;
    generatePrefix: () => string;
    filterable: boolean;
    constructor(bus: IBus<any, any>, prefix?: string, _parent?: Logger);
    createChild(prefix?: string): Logger;
    /**
     * Extra noisy logs which aren't very necessary
     */
    debug(text: string, ...rest: any[]): void;
    /**
     * @deprecated. Use verbose.
     * General logging information to help with debugging
     */
    log(level: LogLevel, text: string, ...rest: any[]): void;
    /**
     * log which should grab the attention of the reader
     */
    info(text: string, ...rest: any[]): void;
    warn(text: string, ...rest: any[]): void;
    error(text: string, ...rest: any[]): void;
    startTimer(timeoutMessage?: string, interval?: number, logLevel?: LogLevel): LogTimer;
    private getPrefix();
    _log(level: number, text: string, ...params: Array<any>): void;
}
export * from "./levels";
