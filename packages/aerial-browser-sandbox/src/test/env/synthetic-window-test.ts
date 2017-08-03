import { expect } from "chai";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../index";

describe(__filename + "#", () => {
  it("can be opened", () => {
    const window = openSyntheticEnvironmentWindow("local://index.html", {
      fetch(info: string) {
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
    })
  });
});