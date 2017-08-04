import { expect } from "chai";
import { waitForDocumentComplete, openTestWindow } from "./utils";
import { 
  SyntheticDOMRenderer,
  openSyntheticEnvironmentWindow, 
  createSyntheticDOMRendererFactory,
} from "../../";

describe(__filename + "#", () => {
  const createTestSyntheticDOMRendererFactory = async () => {
    const targetWindow = openTestWindow(``);
    await waitForDocumentComplete(targetWindow);
    return createSyntheticDOMRendererFactory(targetWindow.window.document);
  };

  it("can render text to the dom renderer", async () => {
    const createSyntheticDOMRenderer = await createTestSyntheticDOMRendererFactory();
    const window = openTestWindow(`hello world`, createSyntheticDOMRenderer);
    await waitForDocumentComplete(window);
    const domRenderer = window.renderer as SyntheticDOMRenderer;
    expect(domRenderer.mount.innerHTML).to.eql("hello world");
  });
});