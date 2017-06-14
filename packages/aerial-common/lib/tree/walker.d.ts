export interface IWalkable {
    visitWalker(walker: ITreeWalker): any;
}
export interface ITreeWalker {
    accept(visitor: IWalkable): any;
}
export declare class TreeWalker implements ITreeWalker {
    readonly each: (node: any) => any;
    private _stopped;
    constructor(each: (node: any) => any);
    accept(visitor: IWalkable): void;
}
