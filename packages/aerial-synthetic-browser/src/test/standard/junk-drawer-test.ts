// import { expect } from "chai";
// import { LogLevel } from "aerial-common";
// import { loadTestBrowser } from "../../test";
// import { SyntheticBrowser, SyntheticHTMLElement } from "../..";

// // poorly organized DOM spec tests. TODO - move these into sep fiels
// describe(__filename + "#", () => {

//   // note that this does not work yet.
//   xit("the HTMLElement prototype can be modified without affecting the original", async () => {
//     const { window } = await loadTestBrowser({
//       "index.js": `HTMLElement.prototype.message = "hello";`
//     }, "index.js");

//     expect(SyntheticHTMLElement.prototype["message"]).to.be.undefined;
//   });

//   it("new elements are instances of HTMLElement", async () => {
//     const { window } = await loadTestBrowser({
//       "index.js": `document.body.appendChild(document.createTextNode(document.createElement("div") instanceof HTMLElement))`
//     }, "index.js");

//     expect(window.document.body.textContent).to.equal("true");
//   });

//   describe("events#", () => {
//     describe("DOMContentLoaded event", () => {
      
//       it("is dispatched after load", async () => {
//         const { window } = await loadTestBrowser({
//           "index.js": `
//             window.addEventListener("DOMContentLoaded", () => {
//               document.body.appendChild(document.createTextNode("DOM content loaded"))
//             })
//           `
//         }, "index.js");


//         expect(window.document.body.textContent).to.equal("DOM content loaded");
//       });
//     });
    
//     describe("load event", () => {

//       it("is dispatched by window after DOMContentLoaded", async () => {
//         const { window } = await loadTestBrowser({
//           "index.js": `
//             let i = 0;
//             window.addEventListener("DOMContentLoaded", () => {
//               i++;
//             })

//             window.addEventListener("load", () => {
//               document.body.appendChild(document.createTextNode(++i));
//             })
//           `
//         }, "index.js");


//         expect(window.document.body.textContent).to.contain("2");
//       });


//       it("can be registered with window.onload", async () => {
//         const { window } = await loadTestBrowser({
//           "index.js": `
//             let i = 0;
//             window.onload = () => document.body.appendChild(document.createTextNode(++i));
//           `
//         }, "index.js");


//         expect(window.document.body.textContent).to.contain("1");
//       });
//     });

//     describe("document", () => {
//       it("scripts property returns a collection of loaded scripts", async () => {
//         const { window } = await loadTestBrowser({
//           "index.html": `
//             <script>  
//               window.onload = () => {
//                 document.querySelector("span").appendChild(document.createTextNode(document.scripts.length));
//               }
//             </script>
//             <span>
//             </span>
//           `
//         }, "index.html");

//         expect(window.document.querySelector("span").textContent).to.contain("1");
//       });

//       it("scripts.item returns the script with the matching index", async () => {
//         const { window } = await loadTestBrowser({
//           "index.html": `
//             <script a="b">  
//               window.onload = () => {
//                 document.querySelector("span").appendChild(document.createTextNode(document.scripts.item(0).getAttribute("a")));
//               }
//             </script>
//             <span>
//             </span>
//           `
//         }, "index.html");

//         expect(window.document.querySelector("span").textContent).to.contain("b");
//       });
//     });
//   });

//   describe("nodes", () => {
//     it("getElementsByTagName returns an HTMLCollection", async () => {
//       const { window } = await loadTestBrowser({
//         "index.html": `
//           <span>
//             a
//           </span>
//           <div>
//           </div>
//           <script>  
//             document.querySelector("div").appendChild(
//               document.createTextNode(document.getElementsByTagName("span").item(0).textContent.toUpperCase())
//             )
//           </script>
//         `
//       }, "index.html");

//       expect(window.document.querySelector("div").textContent).to.contain("A");
//     });
//   });

//   describe("script tags", () => {
//     it("returns the type of script", async () => {
//       const { window } = await loadTestBrowser({
//         "index.html": `
//           <script type="text/jsx">  

//           </script>
//           <span>
//           </span>
//           <script>
//             document.querySelector("span").appendChild(document.createTextNode(document.scripts.item(0).type));
//           </script>
//         `
//       }, "index.html");

//       expect(window.document.querySelector("span").textContent).to.contain("text/jsx");
//     });
//   });

//   describe("XMLHttpRequest", () => {

//   });
// });