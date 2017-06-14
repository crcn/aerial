// import { IBus } from "mesh";
// import { expect } from "chai";
// import { CallbackBus, MemoryDataStore, DSFindRequest, DSUpdateRequest, DSInsertRequest, DSRemoveRequest } from "mesh";
// import { CallbackBus, MemoryDataStore, DSFindRequest, DSUpdateRequest, DSInsertRequest, DSRemoveRequest } from "mesh-ds";
// import { PostDsNotifierBus } from "./post-ds-notifier";
// import {
//   PostDSMessage,
// } from "../messages";
// describe(__filename + "#", () => {
//   let bus: IBus<any, any>;
//   let dispatchedMessages: Array<PostDSMessage>;
//   beforeEach(() => {
//     dispatchedMessages = [];
//     bus = new PostDsNotifierBus(new MemoryDataStore(), new CallbackBus((request: any) => dispatchedMessages.push(request)));
//   });
//   it("fires a DS_DID_INSERT request after inserting an item", async () => {
//     await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
//     expect(dispatchedMessages.length).to.equal(1);
//     expect(dispatchedMessages[0].type).to.equal(PostDSMessage.DS_DID_INSERT);
//     expect(dispatchedMessages[0].data.a).to.equal("b");
//   });
//   it("fires a DS_DID_UPDATE request after updating an item", async () => {
//     await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
//     await bus.dispatch(new DSUpdateRequest("items", { a: "c" }, { a: "b" }));
//     expect(dispatchedMessages[1].type).to.equal(PostDSMessage.DS_DID_UPDATE);
//     expect(dispatchedMessages[1].data.a).to.equal("c");
//   });
//   it("fires a DS_DID_REMOVE request after updating an item", async () => {
//     await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
//     await bus.dispatch(new DSRemoveRequest("items", { a: "b" }));
//     expect(dispatchedMessages[1].type).to.equal(PostDSMessage.DS_DID_REMOVE);
//     expect(dispatchedMessages[1].data.a).to.equal("b");
//   });
// });
//# sourceMappingURL=post-ds-notifier-test.js.map