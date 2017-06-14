export declare class System {
    constructor();
    readFile(path: string): void;
    writeFile(path: string, content: string): void;
    watchFile(path: string, onChange: Function): void;
}
