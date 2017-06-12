import { CoreEvent } from "../messages";
import { Observable } from "./index";
import { expect } from "chai";
import { CallbackDispatcher } from "@tandem/mesh";

describe(__filename + "#", () => {
  it("can be created", () => {
    new Observable();
  });

  it("can observe the observable for any message", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: message => i++
    });

    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can add multiple observers the observable for any message", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: message => i++
    });
    obs.observe({
      dispatch: message => i++
    });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(2);
  });

  it("can immediately stop an message from propagating", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: (message) => { i++; message.stopImmediatePropagation(); }
    });
    obs.observe({
      dispatch: message => i++
    });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can stop an message from bubbling", () => {
    const obs = new Observable();
    let i = 0;
    obs.observe({
      dispatch: (message) => {
        if (i > 0) message.stopPropagation();
      }
    });

    const obs2 = new Observable();

    obs2.observe({
      dispatch: message => i++
    });

    obs.observe({ dispatch: obs2.notify.bind(obs2) });
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
    obs.notify(new CoreEvent("change"));
    expect(i).to.equal(1);
  });

  it("can unobserve an observable", () => {
    const obs = new Observable();
    let i = 0;
    const observer = new CallbackDispatcher(() => i++);
    obs.observe(observer);
    obs.notify(new CoreEvent("a"));
    expect(i).to.equal(1);
    obs.unobserve(observer);
    obs.notify(new CoreEvent("a"));
    expect(i).to.equal(1);
  });
});