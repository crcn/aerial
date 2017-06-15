[![Build Status](https://secure.travis-ci.org/crcn/aerial.png)](https://secure.travis-ci.org/crcn/aerial) [![Coverage Status](https://coveralls.io/repos/crcn/aerial/badge.svg)](https://coveralls.io/r/crcn/aerial) [![Join the chat at https://gitter.im/crcn/aerial](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/crcn/aerial?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Aerial is a visual programming engine for testing, debugging, and developing _all_ web applications (JavaScript, React, PHP, CSS). 

#### Motivation

Aerial was originally created for [Tandem](http://tandemcode.com) to aid in the realtime development of web applications. With Tandem, users can write code, and immediately see visual elements appear in an editable interface. Users also have the ability to use Sketch-like UI tools for editing visual elements that produces code in any language that supports source maps (HTML, CSS, SASS, SCSS, React). All of this is powered by Aerial. 

![ezgif-2-7c518ea713](https://user-images.githubusercontent.com/757408/26987589-215d52ca-4d1a-11e7-828e-6db361086a83.gif)


The library takes inspiration from many ideas, more notabily Bret Victor's presentation on [the future of programming](https://vimeo.com/36579366). Aerial is an attempt to provide
the APIs necessary for creating realtime programming environments (like Sketch + coding). 

#### How does Aerial work?

Aerial runs your application code in a sandboxed environment that emulates native JavaScript APIs -- currently just for the browser (DOM, navigator, history). All emulated APIs can be inspected so you can test how your application interacts with them. You can also define environment parameters such as browser type, network information (offline, throttled), and even the rendering engine to see how your application looks & behaves in different environments. 

The browser VM supports _native_ rendering, meaning that the HTML & CSS that your application produces can be rendered out to the actual DOM. Native DOM APIs such as `element.getBoundingClientRect`, and `window.getComputedStyle(element)` work the same. The rendering engine is interchangable, and will eventually support _remote_ browsers so that you can run your application code in one local environment (Node for instance), and have its HTML & CSS rendered out to as many native browsers as you want via [Browsertap](browsertap.com).

<!-- example here -->

The renderer can also be customized to target other platforms such as Canvas, WebGL, or just plain strings if you plan on running synthetic browser instances in a headless environment (Server-side rendering via node, or unit testing for instance). This enables you to use Aerial in other ways -- perhaps integrating it with Sketch so that you can code & design your application in realtime (similar to [Airbnb's React-sketchapp](https://github.com/airbnb/react-sketchapp), but with Aerial it may be possible for Sketch to write code, and not limited to React). 

Many of the emulated APIs are enhanced. The DOM & CSSOM for instance both support diffing & patching (just like React). This means that as your application produces new HTML & CSS, only the DOM / CSSOM objects that change get updated. This hot-swapping was originally introduced to allow users to visually edit applications regardless of their technical stack (Ruby, Java, PHP, Angular, anything that produces HTML & CSS).

Aerial uses a dependency graph that can be adapted to any bundling library including SystemJS, CommonJS, Webpack, and Rollup. The environment that uses the dependency graph can be set to re-execute whenever a source file changes. This paired with hot-swapping capabilities allows developers to write code, and see how their application visualy changes in realtime. Manipulating the emulated DOM / CSSOM (programatically, or visually) will write code back to the dependency graph (this mainly leverages source maps). The dependency graph can also be shared across _multiple_ browser instances which _automatically_ reload whenever a shared file changes. Here's an example of that:

![ezgif-2-7e5a33fa16](https://user-images.githubusercontent.com/757408/27011517-0c27d188-4e8b-11e7-8bf1-811b07bce87d.gif)

Aerial can also defer application execution to remote processes using the `RemoteBrowser` object that pairs with the diffing & patching algorithms. This enables you to offload some of the heavy work - possibly to a NodeJS thread, or even remotely (AWS, lamda), for a smooth user experience if you're building a visual editor. 

#### Who is Aerial for?

<!-- There were a few guiding principles when developing Aerial out:

- 
- Cross-browser, and platform testing (mobile, tablet, desktop), should 
-->

This library was designed for developers that want to create tooling for catching visual bugs in web applications. Here are some examples of what you can do with Aeiral:

- Unit testing CSS (this is probably the most general use case) across any browser (Safari, Firefox, Chrome, Mobile) via browsertap.com, and across any application state. 
- Visually QA test every state of your application. Ability to manipulate file resources and see how those changes manifest across all visual states.
- Hook Aerial up to a code editor & build applications visually in realtime (basically Tandem).

#### App examples

- [Tandem](http://tandemcode.com) - visually create web applications. 
- [Code Playground](./examples/tandem-playground) - small visual editor. 
- [Crawler](./examples/tandem-crawler) - crawls a website (up to 20 pages), and displays editable pages. 

#### Code examples

- [Unit testing](./examples/unit-testing) - example of how you can use Tandem for unit testing.
- Custom dependency graph - TODO
- Custom rendering engine - TODO