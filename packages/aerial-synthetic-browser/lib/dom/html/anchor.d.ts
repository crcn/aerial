import { SyntheticHTMLElement } from "./element";
export declare class SyntheticHTMLAnchorElement extends SyntheticHTMLElement {
    private _location;
    hostname: string;
    pathname: string;
    port: string;
    protocol: string;
    hash: string;
    search: string;
    host: string;
    href: string;
    createdCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
