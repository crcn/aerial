import { expect } from "chai";
import { StringScanner } from "./scanner";

describe(__filename + "#", function() {
  it("can be created", function() {
    new StringScanner("source");
  });

  it("can scan for tokens", function() {
    const s = new StringScanner("a bcde 123 4");
    expect(s.scan(/\w+/)).to.equal("a");
    expect(s.scan(/\w+/)).to.equal("bcde");
    expect(s.scan(/\s+/)).to.equal(" ");
    expect(s.scan(/\d{1}/)).to.equal("1");
    expect(s.scan(/\s/)).to.equal(" ");
    expect(s.scan(/\d/)).to.equal("4");
    expect(s.hasTerminated()).to.equal(true);
  });
});
