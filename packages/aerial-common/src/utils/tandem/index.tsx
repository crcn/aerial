import React =  require("react");
import ReactDOM = require("react-dom");

export const reactPreview = (render?: () => any) => {
  return function(ComponentClass: any): Promise<any> {
    const createBodyElement = async () => {
      const element = document.createElement("div");
      ReactDOM.render(render ? await render() : <ComponentClass />, element);
      return element;
    }
    if (ComponentClass) {
      ComponentClass.$$createBodyElement = createBodyElement;
    } else {
      return createBodyElement();
    }
  }
}