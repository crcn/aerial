import fs =  require("fs");
import { FakeBlob } from "./blob";

export class FakeURL {
  static createObjectURL(blob: FakeBlob) {
    return `data:${blob.type},${encodeURIComponent(blob.parts.join(""))}`;
  }
  static revokeObjectURL(url) {
    // do nothing
  }
}

export const URL = typeof window !== "undefined" ? window.URL : FakeURL;

