import { Token } from "./token";
export declare abstract class ITokenizer {
    abstract tokenize(source: string): Array<Token>;
}
