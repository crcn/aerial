import { expect } from "chai";
import { timeout } from "../utils";
import { waitForDocumentComplete } from "./utils";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../index";

describe(__filename + "#", () => {
  it("can can open a simple page", async () => {
    const window = openSyntheticEnvironmentWindow("local://index.html", {
      fetch(info: string) {
        expect(info).to.eql("local://index.html");
        return Promise.resolve({
          text() {
            return Promise.resolve(`
              <html>
                <head>
                </head>
                <body>
                  Test
                </body>
              </html>
            `);
          }
        } as any);
      }
    });

    await waitForDocumentComplete(window);

    const content = window.document.documentElement.outerHTML;
    expect(content).to.eql(`<html><head>
                </head>
                <body>
                  Test
                
              
            </body></html>`);
  });
});