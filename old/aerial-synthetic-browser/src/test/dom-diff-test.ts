import { expect } from "chai";
import { flattenTree } from "aerial-common";
import { generateRandomSyntheticHTMLElement } from "../test";
import chalk =  require("chalk");
import {
  evaluateMarkup,
  SyntheticDOMNode,
  SyntheticWindow,
  SyntheticDOMElement,
  SyntheticCSSObjectEdit,
  SyntheticHTMLElement,
  SyntheticDOMContainerMutationTypes,
  SyntheticDOMElementMutationTypes,
  SyntheticDOMValueNodeMutationTypes,
  SyntheticDOMContainerEdit,
  SyntheticDOMElementEdit,
  SyntheticDocumentEdit,
  SyntheticDocument,
} from "..";
import { SyntheticObjectChangeTypes } from "aerial-sandbox";

describe(__filename + "#", () => {
  [
    // All single edits
    [`a`, `b`, [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]],
    [`<!--a-->`, `<!--b-->`, [SyntheticDOMValueNodeMutationTypes.SET_VALUE_NODE_EDIT]],
    [`<div />`, `<span></span>`, [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT]],
    [`<div></div><span></span>`, `<span></span>`, [SyntheticDOMContainerMutationTypes.REMOVE_CHILD_NODE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [`<div />`, `<div></div><span></span>`, [SyntheticDOMContainerMutationTypes.INSERT_CHILD_NODE_EDIT]],
    [`<span></span><div></div>`, `<div></div><span></span>`, [SyntheticDOMContainerMutationTypes.MOVE_CHILD_NODE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT, SyntheticObjectChangeTypes.SET_SYNTHETIC_SOURCE_EDIT]],
    [`<div id="b"></div>`, `<div id="c"></div>`, [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]],
    [`<div id="b"></div>`, `<div></div>`, [SyntheticDOMElementMutationTypes.SET_ELEMENT_ATTRIBUTE_EDIT]],

  ].forEach(([oldSource, newSource, messageNames]) => {

    it(`diffs & patches ${oldSource} to ${newSource} with ${(messageNames as any).join(" ")} ops`, () => {
      const { document } = new SyntheticWindow(null);
      const anode = document.createElement("div") as SyntheticHTMLElement;
      anode.innerHTML = oldSource as string;
      const bnode = document.createElement("div") as SyntheticHTMLElement;
      bnode.innerHTML = newSource as string;
      const edit  = anode.createEdit().fromDiff(bnode);
      expect(edit.mutations.map(message => message.type)).to.eql(messageNames);
      edit.applyMutationsTo(anode);
      expect(anode.innerHTML).to.equal(newSource);
    });
  });

  it("can apply an insert diff to multiple child nodes", () => {
    const { document } = new SyntheticWindow(null);
    const a = document.createElement("div") as SyntheticHTMLElement;
    a.innerHTML = "<div>hello</div>";
    const b = document.createElement("div") as SyntheticHTMLElement;
    const c = b.clone(true) as SyntheticHTMLElement;
    const edit = b.createEdit().fromDiff(a);
    edit.applyMutationsTo(b);
    edit.applyMutationsTo(c);
    expect(b.innerHTML).to.equal("<div>hello</div>");
    expect(c.innerHTML).to.equal("<div>hello</div>");
  });

  // fuzzy testing
  it("diff & patch a set or random HTML elements", () => {
    for (let i = 50; i--;) {
      const { document } = new SyntheticWindow(null);
      const a = document.createElement("div") as SyntheticHTMLElement;
      const b = document.createElement("div") as SyntheticHTMLElement;
      a.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      b.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      a.createEdit().fromDiff(b).applyMutationsTo(a);
      const mutations = a.createEdit().fromDiff(b).mutations;
      expect(mutations.length).to.equal(0, `

        ${chalk.magenta(a.innerHTML)} -> ${chalk.green(b.innerHTML)}

        Trying to apply edit.mutations from node that should be identical: ${mutations.map(message => message.type)}
      `);
    }
  });



  it("patches the source of each synthetic object", () => {
    for (let i = 10; i--;) {
      const { document } = new SyntheticWindow(null);
      const a = document.createElement("div") as SyntheticHTMLElement;
      const b = document.createElement("div") as SyntheticHTMLElement;
      a.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      b.appendChild(generateRandomSyntheticHTMLElement(document, 8, 4, 5));
      a.createEdit().fromDiff(b).applyMutationsTo(a);

      const asources = flattenTree(a).map(node => node.source);
      const bsources = flattenTree(b).map(node => node.source);

      expect(JSON.stringify(asources)).to.eql(JSON.stringify(bsources));
    }
  });
});