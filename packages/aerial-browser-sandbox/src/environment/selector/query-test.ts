import { expect } from "chai";
// import {
//   evaluateMarkup,
//   SyntheticWindow,
//   SyntheticDocument,
//   SyntheticHTMLElement,
// } from "@tandem/synthetic-browser";
import parse5 = require("parse5");

/*

input[type="radio"][disabled], fieldset[disabled] input[type="radio"],
input[type="checkbox"][disabled],
fieldset[disabled]
input[type="checkbox"],
.radio[disabled],
fieldset[disabled]
.radio,
.radio-inline[disabled],
fieldset[disabled]
.radio-inline,
.checkbox[disabled],
fieldset[disabled]
.checkbox,
.checkbox-inline[disabled],
fieldset[disabled]
.checkbox-inline
*/

describe(__filename + "#", () => {
  [
    [".item", `<div class="div">a</div>b<span>c</span><div class="item">d</div>`, `<div class="item">d</div>`],
    ["#item", `<div id="item">a</div>b<span>c</span>`, `<div id="item">a</div>`],
    ["*", "<div>a</div>b<span>c</span>", "<div>a</div><span>c</span>"],
    ["div", "<div>a</div>b<span>c</span><div>d</div>", "<div>a</div><div>d</div>"],
    ["h1, h2", "<h1>a</h1><h2>b</h2><h3>c</h3>", "<h1>a</h1><h2>b</h2>"],
    ["h1 b", "<h1><span><b>a</b></span></h1><h1><strong>b</strong></h1>", "<b>a</b>"],
    ["h1 > span", "<h1><span>a</span></h1><h1><strong><span>b</span></strong></h1>", "<span>a</span>"],
    ["div + span", "<div>a</div><span>b</span>", "<span>b</span>"],
    ["div ~ span", "<div>a</div><strong>b</strong><span>c</span>", "<span>c</span>"],
    ["[data-test]", "<div data-test='1'>a</div><span>c</span>", `<div data-test="1">a</div>`],
    [":nth-child(2n)", "<div></div>", ""],
    [":nth-child(n+11)", "<div></div>", ""],
    ["[data-test='1']", `<div data-test="1">a</div><span>c</span>`, "<div data-test=\"1\">a</div>"],
    ["[data-test~='b']", `<div data-test="abc b">a</div><span data-test="ac">c</span>`, `<div data-test="abc b">a</div>`],
    ["[data-test|='b']", `<div data-test="ab">a</div><span data-test="b-bc">c</span>`, `<span data-test="b-bc">c</span>`],
    ["[data-test^='b']", `<div data-test="ab">a</div><span data-test="bc">c</span>`, `<span data-test="bc">c</span>`],
    ["[data-test$='b']", `<div data-test="ab">a</div><span data-test="bc">c</span>`, `<div data-test="ab">a</div>`],
    ["[data-test*='b']", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div><span data-test="bc">c</span>`],
    [`input[type="radio"][disabled],\nfieldset[disabled]\ninput[type="radio"]`, `<input type="radio" disabled />`, `<input type="radio" disabled=""></input>`],
    [`[data-test*=b][class="test"]`, `<div data-test="abc" class="test">a</div><span data-test="bc">c</span>`, `<div data-test="abc" class="test">a</div>`],
    ["div[data-test*=b]", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["*[data-test]", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div><span data-test="bc">c</span>`],
    ["div:active", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["audio:not([controls])", `<audio></audio><audio controls></audio>`, `<audio></audio>`],
    ["div::before", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["div::after", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["div:before", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div>`],
    ["[data-test]::before", `<div data-test="abc">a</div><span data-test="bc">c</span>`, `<div data-test="abc">a</div><span data-test="bc">c</span>`],
    ["svg:not(:root)", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["a:not([href]):not([tabindex])", `<div data-test="abc">a</div><span data-test="bc">c</span>`, ``],
    ["li:nth-child(2)", `<ul><li>a</li><li>b</li></ul>`, `<li>b</li>`],
    ["li:nth-last-child(2)", `<ul><li>a</li><li>b</li><li>c</li><li>d</li></ul>`, `<li>c</li>`],
    ["h1:nth-of-type(2)", `<ul><h1>a</h1><h2>b</h2><h1>c</h1><h2>d</h2><h1>e</h1><h2>f</h2></ul>`, `<h1>c</h1>`],
    ["h1:nth-last-of-type(2)", `<ul><h1>a</h1><h2>b</h2><h1>c</h1><h2>d</h2><h1>e</h1><h2>f</h2><h1>g</h1><h2>h</h2></ul>`, `<h1>e</h1>`],
  ].forEach(([selector, a, b]) => {
    xit(`selector ${selector} for ${a} equals ${b}`, () => {
      // const { document } = new SyntheticWindow();
      
      // document.registerElement("div", SyntheticHTMLElement);
      // document.registerElement("span", SyntheticHTMLElement);
      // document.removeAllChildren();
      // document.appendChild(evaluateMarkup(parse5.parseFragment(a, { locationInfo: true }) as any, document));
      // const nodes = document.querySelectorAll(selector);
      // expect(nodes.join("")).to.equal(b);
    });
  });
});