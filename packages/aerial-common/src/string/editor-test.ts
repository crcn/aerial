import {expect} from "chai";
import {StringEditor, StringMutation} from "./editor";

describe(__filename + "#", () => {
  it("can be created", () => {
    new StringEditor("abba");
  });

  [
    [
      `abc`,
      [0, 1, `aaa`, `aaabc`],
      [1, 2, `bbb`, `aaabbbc`],
      [2, 3, `ccc`, `aaabbbccc`]
    ],
    [
      `abc`,
      [1, 2, `bbb`, `abbbc`],
      [2, 3, `ccc`, `abbbccc`],
      [0, 1, `aaa`, `aaabbbccc`]
    ],
    [
      `abc`,
      [0, 0, `aaa`, `aaaabc`],
      [1, 1, `bbb`, `aaaabbbbc`],
      [2, 3, `ccc`, `aaaabbbbccc`],
    ],
    [
      `abc`,
      [0, 0, `def`, `defabc`],
      [0, 1, `ghi`, `defghibc`]
    ],
    [
      `abcdefghijklmno`,
      [5, 10, ``, `abcdeklmno`],
      [1, 7, ``, `aklmno`]
    ],
    [
      `abc`,
      [1, 2, ``, `ac`],
      [1, 1, `d`, `adc`]
    ],
    [
      `abc`,
      [1, 2, ``, `ac`],

      // cannot edit since value does not exist anymore
      [1, 2, `d`, `ac`]
    ],
    [
      `ab`,
      [0, 1, `ddd`, `dddb`],
      [0, 2, `ccc`, `dddccc`]
    ],
    
    [
      `abcdef`,
      [1, 4, `g`, `agef`],

      // overlapping, so invalid
      [1, 3, `hi`, `agef`]
    ],
    [
      `abc`,
      [1, 2, `de`, `adec`],
      [1, 1, `f`, `afdec`]
    ],
    [
      `<a>abc</a>`,
      [3, 3, `<b></b>`, `<a><b></b>abc</a>`],
      [3, 6, `def`, `<a><b></b>def</a>`]
    ],
    [
      `abcdefghij`,
      [2, 6, `klmno`, `abklmnoghij`],
      [1, 7, `pq`, `abklmnoghij`]
    ],
    [
      `<a b c d></a>`,
      [2, 4, ``, `<a c d></a>`],
      [4, 6, ``, `<a d></a>`],
      [6, 8, ``, `<a></a>`],
      [2, 2, ` d`, `<a d></a>`],
    ]
  ].forEach(([input, ...steps]: any) => {
    it(`can convert ${input} to ${steps[steps.length - 1][3]} with ${JSON.stringify(steps)}`, () => {
      const editor = new StringEditor(input);
      const mutations = [];
      for (const [startIndex, endIndex, newValue, currentOutput] of steps) {
        mutations.push(new StringMutation(startIndex, endIndex, newValue));
        if (currentOutput) {
          expect(editor.applyMutations(mutations)).to.eql(currentOutput);
        }
      }
    });
  });
});