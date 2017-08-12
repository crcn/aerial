import { openTestWindow, waitForDocumentComplete, wrapHTML } from "./utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can append a new child", async () => {
    const window = openTestWindow(wrapHTML());
    await waitForDocumentComplete(window);
    const child = window.document.body.appendChild(window.document.createTextNode("a"));
    expect(child.parentElement).to.eql(window.document.body);
    expect(window.document.body.childNodes.length).to.eql(1);
  });

  it("removes a child from a previous parent when appending", async () => {
    const window = openTestWindow(wrapHTML(`<h1></h1><h2></h2>`));
    await waitForDocumentComplete(window);
    const h1 = window.document.querySelector("h1");
    const child = h1.appendChild(window.document.createTextNode("a"));
    expect(h1.childNodes.length).to.eql(1);
    const h2 = window.document.querySelector("h2");
    h2.appendChild(child);
    expect(h2.childNodes.length).to.eql(1);
    expect(h1.childNodes.length).to.eql(0);
  });

  it("can insert a child before an existing one", async () => {
    const window = openTestWindow(wrapHTML());
    await waitForDocumentComplete(window);
    const body = window.document.body;
    const a = body.appendChild(window.document.createTextNode("a"));
    const b = body.insertBefore(window.document.createTextNode("b"), a);

    expect(body.childNodes.length).to.eql(2);
    expect(body.childNodes[0]).to.eql(b);
    expect(body.childNodes[1]).to.eql(a);
  });

  it("can insert a document fragment before an existing child", async () => {
    const window = openTestWindow(wrapHTML());
    await waitForDocumentComplete(window);
    const body = window.document.body;

    const a = body.appendChild(window.document.createTextNode("a"));
    const fragment = window.document.createDocumentFragment();
    fragment.appendChild(window.document.createTextNode("b"));
    fragment.appendChild(window.document.createTextNode("c"));
    fragment.appendChild(window.document.createTextNode("d"));
    body.insertBefore(fragment, a);

    expect(body.innerHTML).to.eql("bcda");
  });
});