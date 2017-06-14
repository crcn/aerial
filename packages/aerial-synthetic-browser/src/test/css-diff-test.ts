import { expect } from "chai";
import { generateRandomStyleSheet } from "../test/helpers";
import { flattenTree } from "aerial-common";
import chalk =  require("chalk");
import { 
  parseCSS,
  evaluateCSS,
  SyntheticCSSStyleSheet,
  SyntheticCSSObjectEdit,
  SyntheticCSSGroupAtRuleEdit,
  CSSGroupingRuleMutationTypes,
  SyntheticCSSElementStyleRuleEdit,
  SyntheticCSSElementStyleRuleMutationTypes,
} from "..";
import { SyntheticObjectChangeTypes } from "@tandem/sandbox";


describe(__filename + "#", () => {

  // all CSS edits
  [

    // style rule edits
    [".a { color: red }", ".a { color: blue }", [SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],

    // style sheet edits
    [".a {}", ".b {}", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
    [".a {}", ".b {} .a {}", [CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {}", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {} .a {}", [CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".a {} .c {} .b {}", [CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [".a {} .b {}", ".b {} .c {} .a {}", [CSSGroupingRuleMutationTypes.MOVE_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [`*[class*="col-"] { padding: 10px; }`, `*[class*="col-"] { padding: 8px; }`, [SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],

    // media query edits
    ["@media a { .a { color: red } }", "@media b { .a { color: red } }", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
    ["@media a { .a { color: red } }", "@media b { .a { color: red } } @media a { .a { color: red } }", [CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    ["@media a { .a { color: red } }", "@media a { .b { color: red } }", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],

    // font face
    ["@font-face { font-family: Helvetica }", "@font-face { font-family: Arial }", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
    ["@font-face { font-family: Helvetica }", "@font-face { font-family: Arial }", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],

    ["@keyframes a { 0% { color: red; }}", "@keyframes b { 0% { color: red; }}", [CSSGroupingRuleMutationTypes.REMOVE_RULE_EDIT, CSSGroupingRuleMutationTypes.INSERT_RULE_EDIT]],
    ["@keyframes a { 0% { color: red; }}", "@keyframes a { 0% { color: blue; }}", [SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT,SyntheticCSSElementStyleRuleMutationTypes.SET_DECLARATION]],

    // failed fuzzy tests
    [`.g{}.g{b:b;e:b;}.b{}.f{c:b;b:bf;}.e{}`, `.c{e:cf;a:a;}.c{}.e{}.b{c:g;e:ec;d:da;}.d{a:dg;g:b;c:c;}.g{d:ea;e:f;f:b;}`, false],
    [`.f{g:ad;c:g;a:dg;e:fc;}.g{a:gc;d:ad;g:c;}.c{c:b;g:bc;}`, `.c{g:fd;d:fg;f:ef;a:e;}.b{e:e;}.c{e:e;d:bc;}.g{a:g;b:gc;f:f;e:bc;}.f{}.g{c:af;}`, false]
  ].forEach(([oldSource, newSource, mutationTypes]) => {
    it(`Can diff & patch ${oldSource} to ${newSource} with ops: ${mutationTypes}`, () => {
      const a = evaluateCSS(parseCSS(oldSource as string));
      const b = evaluateCSS(parseCSS(newSource as string));
      const edit = a.createEdit().fromDiff(b);


      expect(edit.mutations.length).not.to.equal(0);
      
      edit.applyMutationsTo(a, (target, message) => {
        // for debugging
        // console.log("applied %s:\n%s", chalk.magenta(message.toString()), chalk.green(removeWhitespace(a.cssText)));
      });
      expect(removeWhitespace(a.cssText)).to.equal(removeWhitespace(b.cssText));
      if (mutationTypes) {
        expect(edit.mutations.map(mutation => mutation.type)).to.eql(mutationTypes);
      }

      // ensure that there are no more changes
      expect(a.createEdit().fromDiff(b).mutations.length).to.equal(0);
    });
  });

  // TODO - use formatter instead to remove whitespace
  function removeWhitespace(str) {
    return str.replace(/[\r\n\s\t]+/g, " ");
  }

  // fuzzy testing
  it("can diff & patch random CSS style sheets", () => {
    let prev: SyntheticCSSStyleSheet;
    for (let i = 100; i--;) {
      let curr = generateRandomStyleSheet(10, 5);

      if (!prev) {
        prev = curr;
        continue;
      }

      const pp = prev.clone(true);
      prev.createEdit().fromDiff(curr).applyMutationsTo(prev);

      const mutations = prev.createEdit().fromDiff(curr).mutations;
      expect(mutations.length).to.equal(0, `

        Couldn't properly patch ${chalk.grey(removeWhitespace(pp.cssText))} -> ${chalk.green(removeWhitespace(prev.cssText))} ->
        ${chalk.magenta(removeWhitespace(curr.cssText))}


        Trying to apply edit.changes from a stylesheet that should be identical: ${mutations.map(message => message.type)}
      `);
    }
  });

  it("patches the source of each synthetic object", () => {
      const a = generateRandomStyleSheet(10, 5);
      const b = generateRandomStyleSheet(10, 5);
      a.createEdit().fromDiff(b).applyMutationsTo(a);

      const asources = flattenTree(a).map(node => node.source);
      const bsources = flattenTree(b).map(node => node.source);

      expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
  });
});