import { openTestWindow, waitForDocumentComplete } from "./utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can execute a simple script", async () => {
    const logs = [];
    const window = openTestWindow(`<script>console.log("hello");</script>`, {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    expect(logs).to.eql(["hello"]);
  });

  it("can attach a value to the global window object via this", async () => {
    const logs = [];
    const window = openTestWindow(`<script>window.a = 1;</script>`);
    await waitForDocumentComplete(window);
    expect(window["" + "a"]).to.eql(1);
  });

  it("can fetch values from previously executed scripts", async () => {
    const logs = [];
    const window = openTestWindow(`<script>window.a = 1;</script><script>console.log(window.a);</script>`, {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    expect(logs).to.eql([1]);
  });

  it("is executed before proceeding child nodes are added", async () => {
    const logs = [];
    const window = openTestWindow(`<script>console.log(document.querySelector("span"));</script><span></span>`, {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    expect(logs).to.eql([undefined]);
  });

  it("can execute a script that queries the element it's executed in", async () => {
    const logs = [];
    const window = openTestWindow(`<script>console.log(document.querySelector("script").textContent);</script><span></span>`, {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    expect(logs).to.eql([`console.log(document.querySelector(\"script\").textContent);`]);
  });
}); 