import { expect } from "chai";
import { wrapHTML, openTestWindow, waitForDocumentComplete } from "./utils";

describe(__filename + "#", () => {
  describe("basic", () => {
    it("can parse CSS", async () => {
      const window = await openTestWindow(wrapHTML(`
      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>`));
      await waitForDocumentComplete(window);
      const style = window.document.querySelector("style");
      expect(style).not.to.be.undefined;

      console.log(style.sheet);
    });
  });
  describe("diff/patch#", () => {
    
  });
});