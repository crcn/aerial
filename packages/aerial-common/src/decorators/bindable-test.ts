import { bindable } from "./bindable";
import { expect } from "chai";
import { IMessage } from "mesh";
import { Observable } from "../observable";

describe(__filename + "#", () => {
  it("can make a property bindable for changes", () => {
    class Item extends Observable {
      @bindable()
      public name: string;
    }

    const item = new Item();
    let lastMessage:  IMessage;
    item.observe({
      dispatch: message => lastMessage = message
    });

    item.name = "john";
    expect(lastMessage.type).to.equal("mutation");

  });
});