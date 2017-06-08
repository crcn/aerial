import path =  require("path");
import { JS_MIME_TYPE } from "@tandem/common";
import { SyntheticHTMLElement } from "./element";
import { compileGlobalSandboxScript, runGlobalSandboxScript } from "@tandem/sandbox";

export class SyntheticHTMLScriptElement extends SyntheticHTMLElement {
  private _executed: boolean;

  get src() {
    return this.getAttribute("src");
  }

  get text() {
    return this.textContent;
  }

  set text(value: string) {
    this.textContent = value;
    this.executeScript();
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  attachedCallback() {
    this.executeScript();
  }

  get type() {
    return this.getAttribute("type");
  }

  executeScript() {
    if (this._executed || !this._attached) return;

    const src = this.getAttribute("src");
    const type = this.getAttribute("type");

    if (type && (type !== "text/javascript" && type !== "application/javascript")) return;

    const module  = this.$module;
    const sandox  = this.ownerDocument.sandbox;
    const window  = this.ownerDocument.defaultView;
    const source  = this.$source;
    const content = src ? module && module.source.eagerGetDependency(src).content : this.textContent;


    if (!content) return;

    this._executed = true;

    try {
      const uri = src || source && source.uri || window.location.toString();

      // node that $module will only exist if the script is evaluated from an HTML file

      // TODO - this doesn't work.. need 
      const script = compileGlobalSandboxScript(uri, uri, content);
      runGlobalSandboxScript(script, sandox);
    } catch(e) {
      console.error(e.stack);
    }
  }
}