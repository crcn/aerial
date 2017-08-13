import { openTestWindow, waitForDocumentComplete, stripWhitespace, wrapHTML } from "./utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can execute a simple script", async () => {
    const logs = [];
    const window = openTestWindow(wrapHTML(`<script>console.log("hello");</script>`), {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    expect(logs).to.eql(["hello"]);
    window.close();
  });

  it("can attach a value to the global window object via this", async () => {
    const logs = [];
    const window = openTestWindow(wrapHTML(`<script>window.a = 1;</script>`));
    await waitForDocumentComplete(window);
    expect(window["" + "a"]).to.eql(1);
  });

  it("can fetch values from previously executed scripts", async () => {
    const logs = [];
    const window = openTestWindow(wrapHTML(`<script>window.a = 1;</script><script>console.log(window.a);</script>`), {
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
    window.close();
  });

  xit("can append an element immediately after the script", async () => {
    const logs = [];
    const window = openTestWindow(wrapHTML(`<span><script>
      const script = document.querySelector("script");
      script.parentElement.appendChild(document.createTextNode("hello"));
    </script><span></span></span>`), {
      console: {
        log(text) {
          logs.push(text);
        } 
      } as any
    });
    await waitForDocumentComplete(window);
    window.close();
    const innerHTML = stripWhitespace(window.document.body.innerHTML);
    expect(innerHTML).to.eql(`<span><script>const script = document.querySelector("script");script.parentElement.appendChild(document.createTextNode("hello"));</script>hello<span></span></span>`);
  });

  xit("can load from an external resource", async () => {
    const window = openTestWindow({
      "local://index.html": wrapHTML(`
        <span>
          <script src="local://index.js"></script>
          <span>a</span>
        </span>
      `),
      "local://index.js": `
        const script = document.querySelector("script");
        script.parentElement.appendChild(document.createTextNode("b"));
      `
    });

    await waitForDocumentComplete(window);
    window.close();
    expect(stripWhitespace(window.document.body.innerHTML)).to.eql(`<span><script src="local://index.js"></script>b<span>a</span></span>`);
  });
}); 