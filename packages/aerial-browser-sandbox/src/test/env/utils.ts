import { expect } from "chai";
import { timeout } from "../utils";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../index";

export const openTestWindow = (html: string) => openSyntheticEnvironmentWindow("local://index.html", {
  fetch(info: string) {
    expect(info).to.eql("local://index.html");
    return Promise.resolve({
      text() {
        return Promise.resolve(html);
      }
    } as any);
  }
});

export const waitForDocumentComplete = (window: Window) => new Promise((resolve) => {
  window.document.onreadystatechange = () => {
    if (window.document.readyState === "complete") {
      resolve();
    }
  }
})

export * from "../utils";