import { expect } from "chai";
import { openTestWindow, wrapHTML, waitForDocumentComplete } from "./utils";

describe(__filename + "#", () => {
  it("can clone the element", async () => {
    const window = openTestWindow(wrapHTML(`<span></span>`));
    await waitForDocumentComplete(window);
    const span = window.document.querySelector("span");
    const span2 = span.cloneNode(true);
    expect(span2).not.to.eql(span);
    expect(span2.nodeName).to.eql(span.nodeName);
    expect(span2.childNodes.length).to.eql(0);
  });

  it("can clone an element with attributes", async () => {
    const window = openTestWindow(wrapHTML(`<span a="b" c="d"></span>`));
    await waitForDocumentComplete(window);
    const span = window.document.querySelector("span");
    const span2 = span.cloneNode(true);
    expect(span2).not.to.eql(span);
    expect(span2.attributes.length).to.eql(2);
  });


  xit("can clone deep", async () => {
    const window = openTestWindow(wrapHTML(`<span a="b" c="d">a</span>`));
    await waitForDocumentComplete(window);
    const span = window.document.querySelector("span");
    const span2 = span.cloneNode(true);
    expect(span2).not.to.eql(span);
    expect(span2.attributes.length).to.eql(2);
  });


  xit("can clone shallow", async () => {
    const window = openTestWindow(wrapHTML(`<span a="b" c="d"></span>`));
    await waitForDocumentComplete(window);
    const span = window.document.querySelector("span");
    const span2 = span.cloneNode(true);
    expect(span2).not.to.eql(span);
    expect(span2.attributes.length).to.eql(2);
  });
});