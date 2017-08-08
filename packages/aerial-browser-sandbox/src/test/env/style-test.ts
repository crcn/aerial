import { expect } from "chai";
import { timeout, waitForDocumentComplete } from "./utils";
import { openTestWindow } from "./utils";
import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../environment";

describe(__filename + "#", () => {
  it("can load a simple style sheet", async () => {
    const window = openTestWindow(`
      <html>
        <head>
          <style>
            body {
              margin: 0px;
            }
          </style>
        </head>
        <body>
        </body>
      </html>
    `);

    await waitForDocumentComplete(window);
    const style = window.document.head.children[0] as HTMLStyleElement;
    expect(style.sheet).not.to.eql(undefined);
  });
});