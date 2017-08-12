import { openTestWindow, waitForDocumentComplete, wrapHTML } from "./utils";
import { expect } from "chai";

describe(__filename + "#", () => {
  it("can be registered and used", async () => {
    const window = openTestWindow(wrapHTML(`<span>content</span>`));
    await waitForDocumentComplete(window);
    class TestElement extends window.HTMLElement {

    }
    window.customElements.define("x-test", TestElement);
    const el = window.document.createElement("x-test");
    expect(el).to.be.an.instanceOf(TestElement);
  });

  describe("calls connectedCallback", () => {
    it("when it's added to the document", async () => {
      const window = openTestWindow(wrapHTML());
      await waitForDocumentComplete(window);
      let _inserted = false;
      class TestElement extends window.HTMLElement {
        connectedCallback() {
          _inserted = true;
        }
      }
      window.customElements.define("x-test", TestElement);
      const el = window.document.createElement("x-test");
      window.document.body.appendChild(el);
      expect(_inserted).to.eql(true);
    });
    it("when it's ancestor is added to the document", async () => {
      const window = openTestWindow(wrapHTML());
      await waitForDocumentComplete(window);
      let _insertedCount = 0;
      class TestElement extends window.HTMLElement {
        connectedCallback() {
          _insertedCount++;
        }
      }

      window.customElements.define("x-test", TestElement);
      const e = window.document.createElement("div");
      e.appendChild(window.document.createElement("x-test"));
      window.document.body.appendChild(e);
      expect(_insertedCount).to.eql(1);
    });
    it("when it's nested in a custom element that's added to the document", async () => {
      const window = openTestWindow(wrapHTML());
      await waitForDocumentComplete(window);
      let _insertedCount = 0;
      class TestElement extends window.HTMLElement {
        connectedCallback() {
          _insertedCount++;
        }
      }
      

      window.customElements.define("x-test", TestElement);
      const e = window.document.createElement("x-test");
      e.appendChild(window.document.createElement("x-test"));
      window.document.body.appendChild(e);
      expect(_insertedCount).to.eql(2);
    });
    it("when it's inserted into the document multiple times", async () => {
      const window = openTestWindow(wrapHTML());
      await waitForDocumentComplete(window);
      let _insertedCount = 0;
      class TestElement extends window.HTMLElement {
        connectedCallback() {
          _insertedCount++;
        }
      }

      window.customElements.define("x-test", TestElement);
      const e = window.document.createElement("x-test");
      window.document.body.appendChild(e);
      window.document.body.appendChild(e);
      expect(window.document.body.childNodes.length).to.eql(1);
    });
  });

  describe("attributeChangedCallback ", () => {
    xit("gets called when an attribute changes");
  });

  describe("disconnectedCallback ", () => {
    xit("gets called when detached from the document");
  });

  describe("adoptedCallback ", () => {
    xit("gets called when adopted into a different document");
  });

});