/// <reference types="node" />
import net = require("net");
import { ISerializer } from "..";
import { IBus, IMessageTester, IStreamableBus, RemoteBusMessageTester, TransformStream } from "mesh";
export interface ISockBusOptions {
    family: string;
    connection: net.Socket;
    testMessage: RemoteBusMessageTester<any>;
}
export declare class SockBus implements IStreamableBus<any>, IMessageTester<any> {
    private _remoteBus;
    constructor({family, connection, testMessage}: ISockBusOptions, localBus: IBus<any, any>, serializer?: ISerializer<any, any>);
    testMessage(message: any): boolean;
    dispose(): void;
    dispatch(message: any): TransformStream<{}, {}>;
}
