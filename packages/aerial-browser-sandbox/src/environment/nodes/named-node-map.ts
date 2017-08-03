import { weakMemo } from "aerial-common2";
import { getSEnvEventTargetClass } from "../events";

export const getSEnvNamedNodeMapClass = weakMemo((window: Window) => {
  const SEnvEventTarget = getSEnvEventTargetClass(window);

  return class SEnvNamedNodeMap implements NamedNodeMap {
    readonly length: number;
    [index:number]: Attr;

    getNamedItem(name: string): Attr {
      return null;
    }

    getNamedItemNS(namespaceURI: string | null, localName: string | null): Attr {
      return null;
    }

    item(index: number): Attr {
      return null;
    }
    
    removeNamedItem(name: string): Attr {
      return null;
    }
    
    removeNamedItemNS(namespaceURI: string | null, localName: string | null): Attr {
      return null;
    }

    setNamedItem(arg: Attr): Attr {
      return null;
    }

    setNamedItemNS(arg: Attr): Attr {
      return null;
    }

  }
});
