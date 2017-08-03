import { expect } from "chai";
import { timeout } from "../utils";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../index";

describe(__filename + "#", () => {
  it("can be opened", async () => {
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

    await timeout(10);

    const content = window.document.documentElement.outerHTML;
    expect(content).to.eql(`<HTML><HEAD>
                </HEAD>
                <BODY>
                  Test
                
              
            </BODY></HTML>`);
  });
});