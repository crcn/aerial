export declare class SyntheticLocalStorage {
    private _data;
    constructor(_data?: Map<string, string>);
    readonly length: number;
    getItem(key: any): string;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
    key(index: number): any;
}
