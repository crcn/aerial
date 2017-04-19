import { expect } from "chai";
import { SyntheticDOMRenderer } from "./index";
import { SyntheticWindow, SyntheticDocument, SyntheticHTMLStyleElement } from "@tandem/synthetic-browser";
import { generateRandomSyntheticHTMLElementSource, generateRandomStyleSheet } from "@tandem/synthetic-browser/test/helpers";

describe(__filename + "#", () => {

  const removeExtraWhitespace = (str) => str.replace(/[\s\r\n\t]+/g, " ");

  const createDocument = (html = "") => {
    const document  = new SyntheticWindow().document;
    document.registerElement("style", SyntheticHTMLStyleElement);
    document.body.innerHTML = html;
    return document;
  }

  const createRenderer = (sourceDocument: SyntheticDocument) => {

    const fakeDocument = createDocument();

    const renderer = new SyntheticDOMRenderer({ nodeFactory: fakeDocument as any });
    fakeDocument.body.appendChild(renderer.element as any);
    renderer.start();
    renderer.document = sourceDocument;

    return {
      render: async () => {
        await renderer.requestRender();
        return {
          css: fakeDocument.styleSheets[0].cssText,
          html: (<HTMLElement>renderer.element.lastChild.lastChild).innerHTML,
        }
      }
    }
  }

  const fuzzyCSSCases = Array.from({ length: 10 }).map(v => [removeExtraWhitespace(generateRandomStyleSheet(4).cssText), ``]);
  const fuzzyHTMLCases = Array.from({ length: 10 }).map(v => [``, generateRandomSyntheticHTMLElementSource(5, 5, 2)]);

  [

    // basic rendering
    [[``, `<div>hello</div>`]],
    [[``, `<div a="b">hello</div>`]],
    [[``, `<div a="b" c="d">hello</div>`]],
    [[``, `<ul><li>a</li><li>b</li><li>c</li></ul>`]],
    [[``, `<!--comment-->`]],
    [[`.container { color: red; } `, `<div></div>`]],

    // fuzzy
    // [[``, generateRandomSyntheticHTMLElementSource(10, 10, 2)]],

    // // HTML mutations
    [[``, `<div>a</div>`], [``, `<div>b</div>`]],
    [[``, `<div a="b"></div>`], [``, `<div a="c"></div>`]],

    [[``, `<div a="b"></div>`], [``, `<div c="d"></div>`]],
    [[``, `<div>a</div><span>b</span>`], [``, `<span>b</span><div>a</div>`]],

    // fuzzyHTMLCases,

    // CSS Mutations
    [[`.a { color: red; } `, `<div class="a">a</div>`], [`.a { color: blue; } `, `<div class="a">a</div>`]],
    [[`.a { color: red; } `, `<div class="a">a</div>`], [`.a { color: red; } .b { color: green; } `, `<div class="a">a</div>`]],
    [[`.a { color: red; } .b { color: green; } `, `<div class="a">a</div>`], [`.a { color: red; } .b { color: blue; } `, `<div class="a">a</div>`]],
    [[`.a { color: red; } .b { color: green; } `, `<div class="a">a</div>`], [`.a { color: red; } `, `<div class="a">a</div>`]],
    [[`@media a { .b { color: red; } } `, `<div class="a">a</div>`], [`@media a { .b { color: blue; } } `, `<div class="a">a</div>`]],

    // fuzzy
    // fuzzyCSSCases,

  ].forEach(([[inputCSS, inputHTML], ...mutations]) => {

    it(`Can render ${inputCSS} ${inputHTML} -> ${mutations.join(" ")}`, async () => {

      const createdStyledDocument = (css, html) => createDocument(`<style>${css}</style>${html}`);
      const inputDocument = createdStyledDocument(inputCSS, inputHTML);
      const renderer      = createRenderer(inputDocument);

      const assertHTML = ({html, css}, inputCSS, inputHTML) => {
        expect(removeExtraWhitespace(css)).to.equal(removeExtraWhitespace(inputCSS));
        expect(html).to.equal(`<div><div></div><div>${inputHTML}</div></div>`);
      }

      assertHTML(await renderer.render(), inputCSS, inputHTML);

      for (const [mutatedCSS, mutatedHTML] of mutations) {
        const outputDocument = createdStyledDocument(mutatedCSS, mutatedHTML);
        inputDocument.createEdit().fromDiff(outputDocument).applyMutationsTo(inputDocument);

        assertHTML(await renderer.render(), mutatedCSS, mutatedHTML);
      }
    });
  });
});