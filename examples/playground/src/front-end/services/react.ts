import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, inject } from "aerial-common";
import { BaseFrontEndService } from "./base";
import { Message } from "mesh";
import { throttle } from "lodash";
import { RootComponentProvider } from "../providers";


const RENDER_MS = 1000 / 35;

export class ReactService extends BaseFrontEndService {
  dispatch(message: Message) {
    this.render();
  }

  testMessage() {
    return true;
  }

  render = throttle(() => {
    ReactDOM.render(RootComponentProvider.create({
      kernel: this.kernel
    }, this.kernel), this.config.element);
  }, RENDER_MS)
}
