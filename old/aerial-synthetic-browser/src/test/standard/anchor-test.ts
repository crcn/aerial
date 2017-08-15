import { loadTestBrowser } from "../utils";
import { expect } from "chai";
import { LogLevel } from "aerial-common";
import { SyntheticBrowser, SyntheticHTMLElement } from "../..";

// poorly organized DOM spec tests. TODO - move these into sep fiels
describe(__filename + "#", () => {

  // note that this does not work yet.
  it("anchor tags have a pathname property", async () => {
    const { window } = await loadTestBrowser({
      "index.html": `
        <a href="http://localhost:8080/a/b/c/d?e=f#/hash/path"></a>
        <script>
          const a = document.querySelector("a");
          const parts = {
            href: a.href,
            pathname: a.pathname,
            host: a.host,
            hostname: a.hostname,
            protocol: a.protocol,
            port: a.port,
            hash: a.hash
          }
          document.appendChild(document.createTextNode(JSON.stringify(parts)))
        </script>
      `
    }, "index.html");

    expect(window.document.lastChild.textContent).to.equal(JSON.stringify({
      href: "http://localhost:8080/a/b/c/d?e=f#/hash/path",
      pathname: "/a/b/c/d",
      host: "localhost:8080",
      hostname: "localhost",
      protocol: "http:",
      port: "8080",
      hash: "#/hash/path"
    }));
  });

  // note that this does not work yet.
  it("can change any property of the anchor tag and see it reflected in the href", async () => {
    const { window } = await loadTestBrowser({
      "index.html": `
        <a href="http://localhost:8080/a/b/c/d?e=f#/hash/path"></a>
        <span></span>
        <script>
          const a = document.querySelector("a");
          const span = document.querySelector("span");
          span.appendChild(document.createTextNode(a.href + "\\n"));
          a.hostname = "b.com";
          span.appendChild(document.createTextNode(a.href + "\\n"));
          a.protocol = "file:";
          span.appendChild(document.createTextNode(a.href + "\\n"));
          a.pathname = "/e/f";
          span.appendChild(document.createTextNode(a.href + "\\n"));
          a.hash = "/ish";
          span.appendChild(document.createTextNode(a.href + "\\n"));
          a.host = "test.com";
          span.appendChild(document.createTextNode(a.href + "\\n"));
        </script>
      `
    }, "index.html");

    expect(window.document.querySelector("span").textContent).to.equal(
      "http://localhost:8080/a/b/c/d?e=f#/hash/path\n" +
      "http://b.com:8080/a/b/c/d?e=f#/hash/path\n" +
      "file://b.com:8080/a/b/c/d?e=f#/hash/path\n" +
      "file://b.com:8080/e/f?e=f#/hash/path\n" +
      "file://b.com:8080/e/f?e=f#/ish\n" +
      "file://test.com/e/f?e=f#/ish\n"
    );
  });
});