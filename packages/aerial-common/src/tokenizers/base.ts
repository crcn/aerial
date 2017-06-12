import { Token } from "./token";

export abstract class ITokenizer {
  abstract tokenize(source: string): Array<Token>;
}