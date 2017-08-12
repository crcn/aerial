import { expect } from "chai";
import { timeout } from "../utils";
import { once } from "lodash";
import { openTestWindow, waitForDocumentComplete, wrapHTML } from "./utils";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../environment";

describe(__filename + "#", () => {
  describe("event handlers#", () => {
    it("calls onreadystatechange on readystatechange", (next) => {
      const window = openTestWindow(`hello`);
      window.document.onreadystatechange = (event) => {
        window.document.onreadystatechange = () => { };
        expect(event.type).to.eql("readystatechange");
        next();
      }
    });
  });
  describe("events#", () => {
    it("dispatches readystatechange", (next) => {
      const window = openTestWindow(`hello`);
      window.document.addEventListener("readystatechange", once(() => next()));
    });
    it("dispatches DOMContentLoaded", (next) => {
      const window = openTestWindow(`hello`);
      window.document.addEventListener("DOMContentLoaded", once(() => next()));
    });
  });

  describe("methods#", () => {
    describe("document.write ", () => {
      it("appends HTML immediately after a script tag", async () => {
        const window = openTestWindow(wrapHTML(`<span><script>document.write("hello");</script></span>`));
        await waitForDocumentComplete(window);
        expect(window.document.body.innerHTML).to.eql(`<span><script>document.write("hello");</script>hello</span>`);
      });
      it("can be nested", async () => {
        const window = openTestWindow(wrapHTML(`<span><script>document.write("<script>document.write('hello');<" + "/script><h1>b</h1>");</script></span>`));
        await waitForDocumentComplete(window);
        window.close();
        expect(window.document.body.innerHTML).to.eql(`<span><script>document.write("<script>document.write('hello');<" + "/script><h1>b</h1>");</script><script>document.write('hello');</script>hello<h1>b</h1></span>`);
      });
      it("clears the document if document.write is used after the document is loaded", async () => {
        const window = openTestWindow(wrapHTML(`<span>hello</span>`));
        await waitForDocumentComplete(window);
        expect(window.document.body.innerHTML).to.eql(`<span>hello</span>`);
        window.document.write(`<span>b</span>`);
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(window.document.body.innerHTML).to.eql(`<span>b</span>`);
      });
    });
  });
});