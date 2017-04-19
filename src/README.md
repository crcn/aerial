This library contains a *browser VM* that is intented for debugging, designing, and editing web applications. It comes with *loads* of features that enables you perform certain tasks against your application that you couldn't otherwise do in a normal web browser.

#### How does this work?

TODO

<!--#### How does it work?

#### Use cases

This library was initially built for [visually editing web applications](//tandemcode.com), but you can use it in other contexts. Here are a few ideas:

- Visual Q/A testing
- E2E testing-->

#### Features

- [Render HTML & CSS against any browser](#render-html--css-against-any-browser) 
- [Edit the source file of any DOM object](#edit-source-file-of-any-dom-object)
- [Defer application execution to workers](#defer-application-execution-to-worker)
- [Register your own custom protocols](#register-your-own-custom-protocol)
- [DOM objects are diffed & patched](#diffing--patching-dom-objects)
- [Register custom file editors](#register-custom-file-editors) 
- [Custom dependency graph strategy](#custom-dependency-graph-strategy) 

### Render HTML & CSS against any browser

This is a *planned* feature for this library. Though, it's setup to allow *native* rendering for any engine you want. Here's an example:

```typescript

// doesn't exist yet
import { RemoteRenderer } from "@tandem/synthetic-browser-remote-renderer";
import { SyntheticBrowser } from "@tandem/synthetic-browser";

const browser = new SyntheticBrowser(kernel, new RemoteRenderer("chrome@42"));
document.body.appendChild(browser.renderer.element); // return WebRTC preview of what's being rendered in Chrome

const browser = new SyntheticBrowser(kernel, new RemoteRenderer("internet-explorer@10"));
document.body.appendChild(browser.renderer.element); // IE WebRTC preview
```

The renderer receives *just* the HTML & CSS of the application, and provides visual information about each visible element on the page including bounding rectangles (`getBoundingClientRect()`), and computed styles `window.getComputedStyle(element)`. DOM events (clicks, inputs, user events) are also passed to & from the renderer.

#### Diffing & Patching DOM objects

The synthetic browser comes with diffing & patching capabilities (similar to how ReactJS works) that only updates HTML & CSS that have changed. HTML & CSS patching works with any URI resource loaded in the synthetic browser, and is triggered whenever the target application reloads (which occurs when a file resource changes).

There are a few motivations behind the diffing & patching functionality:

- It ensures that DOM objects (HTML elements and CSS rules) are kept as the user is editing their application. This also means that users can make visual adjustments to HTML & CSS and see immediate results while the synthetic browser is applying their edits to source code in the background. 
- [Patches can be sent over the network while diffing & application execution occurs in another process](#defer-application-execution-to-worker). 

Here's a basic example:

```javascript
const browser = new SyntheticBrowser(kernel, new SyntheticDOMRenderer());

// show the app preview
document.body.appendChild(browser.renderer.element); 

// open the URI to preview
await browser.open(`http://google.com`);

// flip the body upside down
const body = browser.document.body;

// apply immediately so that the user sees this
body.style.transform = "rotate(180)";

// dispatch a source file edit.
const edit = body.createEdit();
edit.setAttribute("style", body.style);

// dispatch source file update
await PrivateBusProvider.getInstance(kernel).dispatch(new ApplyFileEditRequest(edit.mutations));

// after some time the synthetic browser will reload with the new changes
setTimeout(() => {

  // body instance is still the same
  console.log(body === browser.document.body);

  // rotate transform is still there
  console.log(body.style); // { transform: "rotate(180)" }
}, 1000);
```

#### Edit source file of any DOM object

The mutations API is used to diff & patch DOM objects whenever an application reloads. The APIs can *also* be used to apply edits to DOM object source files.

```typescript
import { Kernel, PrivateBusProvider } from "@tandem/common"
import { Sandbox, ApplyFileEditRequest } from "@tandem/sandbox";
import { SyntheticBrowser, ISyntheticDOMRenderer } from "@tandem/synthetic-browser";

const kernel = new Kernel(
  // TODO - required deps here
);

// messaging channel for the application
const bus = PrivateBusProvider.getInstance(kernel);

// use just a basic DOM renderer for the synthetic browser. Can be 
// something such as SafariDOMRenderer,  IEDOMRenderer in the future.
const renderer = new SyntheticDOMRenderer();

// display the preview of the web application
document.body.appendChild(renderer.element);

const browser = new SyntheticBrowser(kernel, renderer);

// load google into the synthetic browser. Note that for this to work you'll either
// need to run this example in an Electron app, or register a custom protocol handler that proxies all HTTP requests through a backend.
await browser.open("http://google.com");

const mutations = [];

browser.document.querySelectorAll("div").forEach((element) => {

  // change color of all div elements to red. This will appear
  // immediately in the DOM renderer
  element.style.color = "red";
  const edit = element.createEdit();

  // get the updated style - should contain the red color change
  edit.setAttribute("style", element.getAttribute("style"));

  mutations.push(...edit.mutations);
});

// dispatch a file edit request that will modify the source code
// of each mutated DOM element above. 
await bus.dispatch(new ApplyFileEditRequest(mutations));

// synthetic browser SHOULD be reloaded at this point, and the changes
// displayed to the user
```

You'll notice above that file mutations can be applied to *any resource* that's currently loaded in the synthetic browser, including files from a remote HTTP server.

File mutations don't *actually* mutate the *original* source file. Instead, they're applied to an intermediate caching layer which you can access like so:

```typescript
import { FileCacheProvider } from "@tandem/sandbox";

const fileCache = FileCacheProvider.getInstance(kernel);
await fileCache.save("cache://my/fake/file.txt", { content: "hello world", type: "text/plain" });
const tmpFile   = await fileCache.find("cache://my/fake/file.txt");
const { type, content } = await tmpFile.read();
console.log(content); // hello world
```

> Note that the cache layer will load files from their original source if they do not exist in memory. The caching layer will also watch source files for any changes (either via file watchers, long polling, or short polling), and keep itself up to date. 

Using our previous synthetic browser, we can access the cached file where mutations are applied to. Here's an example assuming that the edits are being to "http://google.com/index.html":

```typescript

// ... PREVIOUS CODE

// dispatch a file edit request that will modify the source code
// of each mutated DOM element above. 
await bus.dispatch(new ApplyFileEditRequest(mutations));

const fileCache = FileCacheProvider.getInstance(kernel);
const tmpFile   = await fileCache.find("http://google.com/index.html");
await { type, content } = await tmpFile.read();
console.log(content); // <html>... <div style="color:red;">...</div></html>
```

If you have *multiple* instances of a synthetic browser that are all loading different variations of a web application and use the same kernel object, then each one of them will *automatically* reload whenever a shared cache resource changes.  For example:

```typescript
const browser1 = new SyntheticBrowser(kernel);
const browser2 = new SyntheticBrowser(kernel);
await browser1.open("file://mywebsite.com/about.html");
await browser2.open("file://mywebsite.com/contact.html");
```

Would likely use the same JavaScript, and CSS files. Assuming that, we can apply a CSS change:

```typescript
const styleSheet = browser1.document.styleSheets[0];
const styleSheetClone = styleSheet.clone(true); 
styleSheetClone.cssText = ""; // remove ALL styles
const edit = styleSheet.createEdit();

// diff against clone & capture all REMOVE mutations
edit.fromDiff(styleSheet);

// dispatch file edits that will be applied to say... file://mywebsite.com/styles/main.css
bus.dispatch(new ApplyFileEditRequest(edit.mutations));
```

*Both* `browser1` and `browser2` instances will receive the above file change assuming that they both share the `main.css` style sheet (they likely would). 

#### Defer application execution to worker

You can connect synthetic browsers together to offload some of the work to other processes. This was primarily created for [Tandem](//tandemcode) to ensure that the UI doesn't lock-up whenever a user visually edits their web application (edits are defered to a separate NodeJS process).

[ EXAMPLE ]

It's also possible to defer web application execution to the cloud through AWS Lamba or some other service. The benefit around this would be to offload *all* of the heavy work to a remote process, allowing you to run *many* variations of your application. This is great especially for [visual Q/A testing](/#visual-qa-testing).

#### Register your own custom protocol

This library currently supports `file://`, and `http(s)://` protocols out of the box. If you need to add your *own*, you can easily do that:

```typescript
import { URIProtocol } from "@tandem/sandbox";
import mime = require("mimetype");

export class CacheProtocol extends URIProtocol {

  private _data: {
    [Identifier: string]: string
  };

  private _watchers: {
    [Identifier: string]: Function[]
  }

  constructor() {
    this._data     = {};
    this._watchers = {};
  }

  async read(uri: string) {
    if (!this._data) throw new Error("File not found.");
  }

  watch2(uri: string, onChange: () => any) {
    if (!this._watchers[uri]) {
      this._watchers[uri] = [];
    }
    this._watchers[uri] 
    return {
      dispose() {
        
      }
    }
  }

  async fileExists(uri: string) {
    return Promise.resolve(!!this._data[uri]);
  }

  async write(uri: string, content: any) {
    this._data[uri] = { type: mime.lookup(uri), content: content };
    if (this._watchers[uri]) {
      for (const listener of this._watchers) {
        this._watchers[uri]();
      }
    }
  }
}
```

The above example demonstrates a custom `cache://` protocol that can be used in a synthetic browser session.


#### Register custom file editors

#### Visual Q/A Testing

This library is *great* for visual Q/A testing since you can run many variations of your application under the same process with different pages, states, and rendering engines. Here's a basic example:

Example:


```javascript

```

- TODO - docs on defering application execution
- 


#### Custom dependency graph strategy

*Still a work in progress*

Tandem will come with (core currently supports it) custom dependency graph strategies for Webpack, Rollup, Browserify, and other bundling systems. For example:

```html
<html>
  <head>
    <script type="text/jsx" src="./index.jsx" data-strategy="webpack" />
  </head>
  <body>
  </body>
</html>
```

Here's what the `index.js` file might look like:

```javascript
import "./index.scss";
import { React } from "react";
import { ReactDOM } from "react-dom";

const HelloComponent extends React.Component {
  render() {
    return <h1>Hello { this.props.message }</h1>;
  }
}

ReactDOM.render(<HelloComponent />, document.body);
```

With the given `webpack` strategy, the synthetic browser will use your `webpack.config.js` to map & transpile your application dependencies. After that, the synthetic browser will run your application like it would in a normal browser. Any change to a mapped dependency will automatically trigger an application reload. 


## API

#### Kernel

Contains all dependencies. Used for dependency injection.

#### SyntheticBrowser(kernel: [Kernel](/#kernel), renderer?: ISyntheticRenderer)

Creates a new synthetic browser that executes web application code in the *current process*.


```typescript
import { Kernel } from "@tandem/common";
import { Sandbox } from "@tandem/sandbox";
import { SyntheticBrowser } from "@tandem/synthetic-browser";

const kernel = new 

const browser = new SyntheticBrowser()
```

#### RemoteSyntheticBrowser(kernel: [Kernel](/#kernel), renderer?: ISyntheticRenderer)



