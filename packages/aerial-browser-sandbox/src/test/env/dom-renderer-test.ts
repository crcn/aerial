import { expect } from "chai";
import { 
  wrapHTML,
  openTestWindow,
  stripWhitespace, 
  waitForDocumentComplete, 
} from "./utils";
import { 
  diffWindow,
  patchWindow,
  SEnvWindowInterface,
  SyntheticDOMRenderer,
  openSyntheticEnvironmentWindow, 
  createSyntheticDOMRendererFactory,
} from "../../environment";

describe(__filename + "#", () => {
  const createTestSyntheticDOMRendererFactory = async () => {
    const targetWindow = openTestWindow(wrapHTML());
    await waitForDocumentComplete(targetWindow);
    return createSyntheticDOMRendererFactory(targetWindow.window.document);
  };

  it("can render text to the dom renderer", async () => {
    const createSyntheticDOMRenderer = await createTestSyntheticDOMRendererFactory();
    const window = openTestWindow(wrapHTML(`hello world`), {
      createRenderer: createSyntheticDOMRenderer
    });
    await waitForDocumentComplete(window);
    const domRenderer = window.renderer as SyntheticDOMRenderer;

    expect(stripWhitespace(domRenderer.mount.innerHTML)).to.eql("<style></style><span><body>hello world</body></span>");
  });


  [
    [`a`, `b`],
    [`<!--c-->`, `<!--d-->`],
    [`<div></div>`, `<div a="b"></div>`],
    [`<div a="b"></div>`, `<div></div>`],
    [`<div a="b"></div>`, `<div a="c"></div>`],
  ].forEach((variants) => {
    it(`properly renders ${variants.join(" -> ")}`, async () => {
      const createSyntheticDOMRenderer = await createTestSyntheticDOMRendererFactory();

      let primaryWindow: SEnvWindowInterface;

      for (const variant of variants) {
        const newWindow = openTestWindow(wrapHTML(variant), {
          createRenderer: createSyntheticDOMRenderer
        });

        await waitForDocumentComplete(newWindow);

        if (primaryWindow) {
          patchWindow(primaryWindow, diffWindow(primaryWindow, newWindow));
          const domRenderer = primaryWindow.renderer as SyntheticDOMRenderer;
          expect(stripWhitespace(domRenderer.mount.innerHTML)).to.eql(`<style></style><span>${newWindow.document.body.outerHTML}</span>`);
        } else {
          primaryWindow = newWindow;
        }
      }
    });
  });
});