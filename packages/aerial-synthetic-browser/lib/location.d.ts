import { Observable } from "aerial-common";
export declare class SyntheticLocation extends Observable {
    private _ignoreRebuild;
    href: string;
    hash: string;
    search: string;
    pathname: string;
    port: string;
    hostname: string;
    protocol: string;
    constructor(urlStr: string);
    host: string;
    toString(): string;
    clone(): SyntheticLocation;
    $copyPropertiesFromUrl(url: string): this;
    $redirect(url: string): void;
    private _parseHref;
    private _rebuildHref;
}
