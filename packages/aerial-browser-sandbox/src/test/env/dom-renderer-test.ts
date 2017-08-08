import { expect } from "chai";
import { 
  openTestWindow,
  stripWhitespace, 
  waitForDocumentComplete, 
} from "./utils";
import { 
  SyntheticDOMRenderer,
  openSyntheticEnvironmentWindow, 
  createSyntheticDOMRendererFactory,
} from "../../environment";

describe(__filename + "#", () => {
  const createTestSyntheticDOMRendererFactory = async () => {
    const targetWindow = openTestWindow(``);
    await waitForDocumentComplete(targetWindow);
    return createSyntheticDOMRendererFactory(targetWindow.window.document);
  };

  it("can render text to the dom renderer", async () => {
    const createSyntheticDOMRenderer = await createTestSyntheticDOMRendererFactory();
    const window = openTestWindow(`hello world`, {
      createRenderer: createSyntheticDOMRenderer
    });
    await waitForDocumentComplete(window);
    const domRenderer = window.renderer as SyntheticDOMRenderer;

    expect(stripWhitespace(domRenderer.mount.innerHTML)).to.eql("<style></style><span>hello world</span>");
  });
});