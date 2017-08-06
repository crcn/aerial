// import { expect } from "chai";
// import { timeout } from "../utils";
// import { openTestWindow } from "./utils";
// import { once } from "lodash";
// import { getSEnvWindowClass, openSyntheticEnvironmentWindow } from "../../index";

// describe(__filename + "#", () => {
//   describe("event handlers#", () => {
//     it("calls onreadystatechange on readystatechange", (next) => {
//       const window = openTestWindow(`hello`);
//       window.document.onreadystatechange = (event) => {
//         window.document.onreadystatechange = () => { };
//         expect(event.type).to.eql("readystatechange");
//         next();
//       }
//     });
//   });
//   describe("events#", () => {
//     it("dispatches readystatechange", (next) => {
//       const window = openTestWindow(`hello`);
//       window.document.addEventListener("readystatechange", once(() => next()));
//     });
//     it("dispatches DOMContentLoaded", (next) => {
//       const window = openTestWindow(`hello`);
//       window.document.addEventListener("DOMContentLoaded", once(() => next()));
//     });
//   });
// });