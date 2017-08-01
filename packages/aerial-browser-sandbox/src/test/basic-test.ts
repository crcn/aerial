import { expect } from "chai";
import { } from "aerial-sandbox2";
describe(__filename + "#", () => {
  it("can open a new synthetic browser window environment", (next) => {
    const { getState, dispatch } = createTestStore({}, function*() {
      yield yield request(createOpenSyntheticBrowserWindowRequest("http://google.com"));
    });
  });
});