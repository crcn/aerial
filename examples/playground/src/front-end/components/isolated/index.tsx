import React =  require("react");
import ReactDOM = require("react-dom");
import { bubbleHTMLIframeEvents, Point } from "aerial-common2";

export class Isolate extends React.Component<{ 
  inheritCSS?: boolean, 
  onMouseDown?: any, 
  onKeyDown?: any,
  onLoad?: any,
  scrollPosition?: Point;
  children: any,
  ignoreInputEvents?: boolean;
  translateMousePositions?: boolean;
  onScroll?: any,
  scrolling?: boolean,
  style?: any,
  onWheel?: any,
  onDragOver?: any,
  className?: string,
  onDrop?: any
}, any> {

  private _mountElement: any;

  componentDidMount() {

    if (window["$synthetic"]) {
      return;
    }

    if (this.props.inheritCSS) {
      const head    = this.head;

      const tags = [
        ...Array.prototype.slice.call(document.getElementsByTagName("style"), 0),
        ...Array.prototype.slice.call(document.getElementsByTagName("link"), 0)
      ];

      Array.prototype.forEach.call(tags, function (style) {
        head.appendChild(style.cloneNode(true));
      });
    }

    this.body.appendChild(this._mountElement = document.createElement("div"));

    if (this.props.onMouseDown) {
      this.body.addEventListener("mousedown", this.props.onMouseDown);
    }

    if (this.props.onKeyDown) {
      this.body.addEventListener("keydown", this.props.onKeyDown);
    }

    this._render();

    this._addListeners();
  }

  componentDidUpdate() {
    this._render();
    const scrollPosition = this.props.scrollPosition as Point;

    if (this.window && scrollPosition) {
      if (scrollPosition.left !== this.window.scrollX || scrollPosition.top !== this.window.scrollY) {
        this.window.scrollTo(scrollPosition.left, scrollPosition.top);
      }
    }
  }

  get window(): Window {
    return (this.refs as any).container.contentWindow;
  }

  get head() {
    return this.window.document.head;
  }

  get body() {
    return this.window.document.body;
  }

  get container() {
    return (this.refs as any).container;
  }

  onLoad = () => {
    if (this.props.onLoad) this.props.onLoad();
  }

  _render() {
    if (window["$synthetic"]) return;
    if (this.props.children && this._mountElement) {
      ReactDOM.render(this.props.children, this._mountElement);
    }
  }

  _addListeners() {
    bubbleHTMLIframeEvents((this.refs as any).container, {
      ignoreInputEvents: this.props.ignoreInputEvents,
      translateMousePositions: this.props.translateMousePositions
    });
  }

  onScroll = (event) => {
    if (this.props.onScroll) this.props.onScroll(event);
    if (this.props.scrolling === false) {
      const db = (this.refs as any).container.contentDocument;
      db.body.scrollLeft = db.body.scrollTop = 0;
    }
  }

  render() {

    // TODO - eventually want to use iframes. Currently not supported though.
    if (window["$synthetic"]) {
      return <span>{this.props.children}</span>;
    }

    return <iframe ref="container" onDragOver={this.props.onDragOver} onDrop={this.props.onDrop} onWheel={this.props.onWheel} onScroll={this.onScroll} onLoad={this.onLoad} className={this.props.className} style={this.props.style} />;
  }
}