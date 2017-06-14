/// <reference types="node" />
import { isMaster, Worker } from "cluster";
import { ChildProcess } from "child_process";
import { IBus, NoopBus, ProxyBus, RemoteBus } from "mesh";
export { isMaster };
export declare const fork: (family: string, localBus: IBus<any, any>, env?: any) => ProxyBus;
export declare const createProcessBus: (family: string, proc: NodeJS.Process | Worker | ChildProcess, target: IBus<any, any>) => RemoteBus<any>;
export declare const hook: (family: string, localBus: IBus<any, any>) => NoopBus;
