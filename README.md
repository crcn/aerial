## validate objects & filter arrays with mongodb queries
[![Build Status](https://secure.travis-ci.org/crcn/aerial.png)](https://secure.travis-ci.org/crcn/aerial) [![Coverage Status](https://coveralls.io/repos/crcn/aerial/badge.svg)](https://coveralls.io/r/crcn/aerial) [![Join the chat at https://gitter.im/crcn/aerial](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crcn/aerial?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Aerial is a virtual browser for the realtime visual development & testing of web applications. 

#### JavaScript example

```typescript
import { SyntheticBrowser, DOMRenderer } from 'aerial';
const renderer = new DOMRenderer(); 

document.body.appendChild(renderer.element);
const browser = new SyntheticBrowser(renderer);
await browser.window.open('http://google.com');

// TODO - edit DOM
```

#### What can you use this library for?

Aerial is currently powering [Tandem](http://tandemcode.com/), but it can be used in many other use cases:

- Running your application in a headless environment such as NodeJS with access to real browser rendering engines via [Browsertap](http://browsertap.com/)
- Visual QA testing
- Your own visual editor

#### Features

Aerial comes with a bunch of features that enables you to run web application code 

- Ability to target any browser rendering engine
- DOM diffing so that client-side editing doesn't get interrupted


#### TODOs

- [ ] Generalize sandbox to be usable in other JS environments