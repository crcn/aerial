import { openTestWindow, waitForDocumentComplete } from "./utils";
import { SEnvNodeInterface, SEnvTextInterface, SEnvCommentInterface } from "../../environment";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("attaches a source property to an element", async () => {
    const window = openTestWindow(`<span></span>`);
    await waitForDocumentComplete(window);
    const span = window.document.body.querySelector("span") as any as SEnvNodeInterface;
    expect(span.source.uri).to.eql("local://index.html");
    expect(span.source.start.line).to.eql(1);
    expect(span.source.start.column).to.eql(1);
  });

  it("attaches a source property to a text node", async () => {
    const window = openTestWindow(`hello`);
    await waitForDocumentComplete(window);
    const text = window.document.body.childNodes[0] as any as SEnvTextInterface;
    expect(text.nodeValue).to.eql("hello");
    expect(text.source.uri).to.eql("local://index.html");
    expect(text.source.start.line).to.eql(1);
    expect(text.source.start.column).to.eql(1);
  });

  it("attaches a source property to a comment", async () => {
    const window = openTestWindow(`hello`);
    await waitForDocumentComplete(window);
    const comment = window.document.body.childNodes[0] as any as SEnvCommentInterface;
    expect(comment.nodeValue).to.eql("hello");
    expect(comment.source.uri).to.eql("local://index.html");
    expect(comment.source.start.line).to.eql(1);
    expect(comment.source.start.column).to.eql(1);
  });
});