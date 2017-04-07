Aerial is a virtual browser for visually creating web applications. 

#### Use cases

Aerial is currently powering [Tandem](http://tandemcode.com/), but it can be used in many other use cases:

- Running your application in a headless environment such as NodeJS with access to real browser rendering engines via [Browsertap](http://browsertap.com/)
- Visual QA testing
- Your own visual editor

#### Example

```typescript
import { SyntheticBrowser } from "aerial";
import { SyntheticBrowsertapRenderer } from 'aerial-browsertap-renderer';

// define the renderer that will display a preview of our website or web application
const renderer = new SyntheticBrowsertapRenderer({ app: { name: "ie", version: 8 }, os: { name: "windows" }});

const browser = new SyntheticBrowser(renderer);

// append the renderer's DOM element to the main body so that we can actually see the preview
document.body.appendChild(renderer.element);

browser.open({ url: 'http://google.com' });
```

#### Features

- Ability to target any browser rendering engine
- DOM diffing so that client-side editing doesn't get interrupted
