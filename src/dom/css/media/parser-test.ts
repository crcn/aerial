import { expect } from "chai";
import { parse } from "./parser.peg";
describe(__filename + "#",  () => {
  [
    ["screen"],
    ["screen and (max-width: 100px)"],
    ["screen and (min-width: 100px) and (max-width: 200px)"],
    ["screen and (min-width: 100px), all and (max-width: 200px)"],
    ["(max-width: 100px)"],
  ].forEach(([media]) => {
    it (`can parse ${media}`, () => {
      parse(media);
    }); 
  });
})