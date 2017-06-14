import { ISyntheticDocumentRenderer } from "./renderers";
import { ISyntheticBrowser, BaseSyntheticBrowser, ISyntheticBrowserOpenOptions } from "./browser";
import { Logger, Status, Kernel, CoreEvent, BaseApplicationService } from "aerial-common";
export declare class RemoteBrowserDocumentMessage extends CoreEvent {
    readonly data: any;
    static readonly NEW_DOCUMENT: string;
    static readonly DOCUMENT_DIFF: string;
    static readonly VM_LOG: string;
    static readonly DOM_EVENT: string;
    static readonly STATUS_CHANGE: string;
    constructor(type: string, data: any);
}
export declare class RemoteSyntheticBrowser extends BaseSyntheticBrowser {
    readonly logger: Logger;
    private _bus;
    private _documentEditor;
    private _remoteStreamReader;
    private _writer;
    status: Status;
    constructor(kernel: Kernel, renderer?: ISyntheticDocumentRenderer, parent?: ISyntheticBrowser);
    open2(options: ISyntheticBrowserOpenOptions): Promise<void>;
    onRemoteBrowserEvent({payload}: {
        payload: any;
    }): void;
    private _mutations;
    private _ignoreMutations;
    protected onDocumentEvent(event: CoreEvent): void;
    /**
     * Send ALL changes to the back-end to ensure that everything is in sync.
     */
    private sendDiffs;
}
export declare class RemoteBrowserService extends BaseApplicationService {
    private _openBrowsers;
    $didInject(): void;
}
