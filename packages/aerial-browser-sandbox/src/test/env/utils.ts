import { expect } from "chai";
import { timeout } from "../utils";
import { openSyntheticEnvironmentWindow, SEnvWindowContext } from "../../environment";

export const openTestWindow = (html: string = "", context: Partial<SEnvWindowContext> = {}) => openSyntheticEnvironmentWindow("local://index.html", {
  fetch(info: string) {
    expect(info).to.eql("local://index.html");
    return Promise.resolve({
      text() {
        return Promise.resolve(html);
      }
    } as any);
  },
  ...(context as any)
});

export const waitForDocumentComplete = (window: Window) => new Promise((resolve) => {
  window.document.onreadystatechange = () => {
    if (window.document.readyState === "complete") {
      resolve();
    }
  }
})

export * from "../utils";