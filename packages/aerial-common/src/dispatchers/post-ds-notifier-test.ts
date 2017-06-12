import { IDispatcher } from "@tandem/mesh";
import { expect } from "chai";
import { CallbackDispatcher, MemoryDataStore, DSFindRequest, DSUpdateRequest, DSInsertRequest, DSRemoveRequest } from "@tandem/mesh";
import { PostDsNotifierBus } from "./post-ds-notifier";
import {
  PostDSMessage,
} from "@tandem/common/messages";

describe(__filename + "#", () => {

  let bus: IDispatcher<any, any>;
  let dispatchedMessages: Array<PostDSMessage>;

  beforeEach(() => {
    dispatchedMessages = [];
    bus = new PostDsNotifierBus(new MemoryDataStore(), new CallbackDispatcher((request: any) => dispatchedMessages.push(request)));
  });

  it("fires a DS_DID_INSERT request after inserting an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    expect(dispatchedMessages.length).to.equal(1);
    expect(dispatchedMessages[0].type).to.equal(PostDSMessage.DS_DID_INSERT);
    expect(dispatchedMessages[0].data.a).to.equal("b");
  });

  it("fires a DS_DID_UPDATE request after updating an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    await bus.dispatch(new DSUpdateRequest("items", { a: "c" }, { a: "b" }));
    expect(dispatchedMessages[1].type).to.equal(PostDSMessage.DS_DID_UPDATE);
    expect(dispatchedMessages[1].data.a).to.equal("c");
  });

  it("fires a DS_DID_REMOVE request after updating an item", async () => {
    await bus.dispatch(new DSInsertRequest("items", { a: "b" }));
    await bus.dispatch(new DSRemoveRequest("items", { a: "b" }));
    expect(dispatchedMessages[1].type).to.equal(PostDSMessage.DS_DID_REMOVE);
    expect(dispatchedMessages[1].data.a).to.equal("b");
  });
});
