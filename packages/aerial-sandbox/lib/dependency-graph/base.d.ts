import { RawSourceMap } from "source-map";
export interface IDependencyContent {
    readonly type: string;
    readonly content: any;
    map?: RawSourceMap;
}
