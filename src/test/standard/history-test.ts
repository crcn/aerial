import { expect } from "chai";
import { LogLevel } from "@tandem/common";
import { SyntheticBrowser, SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { createTestMasterApplication } from "@tandem/editor/test";
import { loadTestBrowser } from "@tandem/synthetic-browser/test";

// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", () => {

  it("Can change the location of the page by manipulating pushState", async () => {
    let browser = await loadTestBrowser({
      "/path/to/index.html": `
        <script>
          history.pushState("a", "page 1", "hello.html");
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.location.pathname).to.equal("/path/to/hello.html");
    expect(browser.window.history.length).to.equal(2);

    browser = await loadTestBrowser({
      "/path/to/index.html": `
        <script>
          history.pushState("a", "page 1", "/hello.html");
          history.pushState("a", "page 1", "/hello2.html");
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.location.pathname).to.equal("/hello2.html");

    expect(browser.window.history.length).to.equal(3);
  });

  it("Can replace the current history state", async () => {
    let browser = await loadTestBrowser({
      "/path/to/index.html": `
        <script>
          history.pushState("a", "page 1", "hello.html");
          history.replaceState("b", "page 2", "hello2.html");
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.location.pathname).to.equal("/path/to/hello2.html");
    expect(browser.window.history.length).to.equal(2);

  });


  it("Returns the current state of the browser", async () => {
    let browser = await loadTestBrowser({
      "/path/to/index.html": `
        <script>
          history.pushState("a", "page 1", "hello.html");
          history.replaceState("b", "page 2", "hello2.html");
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.history.state).to.equal("b");
  });


  it("Can call back/forward/go", async () => {
    let browser = await loadTestBrowser({
      "/path/to/index.html": `
        <script>
          history.pushState("a", "page 1", "a.html");
          history.pushState("b", "page 1", "b.html");
          history.pushState("c", "page 1", "c.html");

          
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.history.state).to.equal("c");
    browser.window.history.back();
    expect(browser.window.history.state).to.equal("b");
    browser.window.history.go(1);
    expect(browser.window.history.state).to.equal("a");
    browser.window.history.go(3);
    expect(browser.window.history.state).to.equal("c");
    browser.window.history.go(1);
    browser.window.history.forward();
    expect(browser.window.history.state).to.equal("b");
  });

  it("window.onpopstate is called when the history changes", async () => {

    let browser = await loadTestBrowser({
      "/path/to/index.html": `
        <span>
        </span>
        <script>
          let locations = [];
          window.onpopstate = () => locations.push(window.location.toString());

          history.pushState("a", "page 1", "a.html");
          history.pushState("b", "page 1", "b.html");
          history.pushState("c", "page 1", "c.html");

          location.hash = "d";

          document.querySelector("span").textContent = locations.join(", ");
        </script>
      `
    }, "file:///path/to/index.html");

    expect(browser.window.document.querySelector("span").textContent).to.equal("file:///path/to/a.html, file:///path/to/b.html, file:///path/to/c.html, file:///path/to/c.html#d");
  });

})