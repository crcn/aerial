very simple online playground for visually creating web applications

GOALS:

- [ ] UX similar to regular browsers
  - [ ] right click inspect element (source code though)
- [ ] built extensions API for windows to hook into
- [ ] developing a language that is optimial for visual development, not hand writing.
  - [ ] visual first, hand-writing second. 
- [ ] appeal to developers first
  - [ ] similar to chrome inspector for now - evolve later on

COMPONENTS TO START VISUAL DEV QUICKLY:

- [ ] CSS Inspector
- [ ] rich visual tools for CSS properties
  - [ ] color picker
  - [ ] convert measurements (px -> %)
- [ ] stage tools
  - [ ] measuring between elements
  - [ ] 
- [ ] Move style properties to CSS declaration

LITMUS:

- [ ] rebuild mesh.js.org (as async await iterator library)
- [ ] rebuild paperclip.js.org 

COOL TO HAVE:

- [ ] SVG editing

IMMEDIATE:

- [ ] synthetic browser tests
- [ ] connect with browser sync
- [ ] properly reload CSS
- [ ] cleanup socket.io connections

NON-GOALS:

- [ ] to cover 100% of UI design & development
- [ ] to attract people with _no_ knowledge of HTML & CSS.

- POLISH:

- [ ] preview mode for windows (opens window in iframe)
- [ ] zoom indicator
- [ ] measurement tooling
- [ ] highlight elements based on text cursor position
- [ ] copy + paste elements
- [ ] meta keywords for controlling UI
  - [ ] `<meta name="no-tools" />`
  - [ ] `<meta name="device=ios5" />` for ios tool overlay
  - [ ] `<meta name="background-task" />` hides window from stage
- [ ] AWS lambda for rendering
- [ ] persisting to local storage needs to reload sibling windows
- [ ] POST needs to reload sibling windows (not self)
- [ ] 

- COMPATIBILITY CHECKLIST:

- [ ] works with browser sync
- [ ] works with webpack HMR

- UX

- [ ] notify user when window doesn't have source maps
  - [ ] possibly dim or overlay elements that are not editable
  - [ ] use popdown
- [ ] identify non-editable elements

CLEANUP:

- [ ] remove file caching. Source of truth needs to be a dev server
- [ ] file cache namespaced to workspace
- [ ] normalize urls - http://site.com/ -> http://site.com
- [ ] use old DOM rendering code
- [ ] synthetic window timers
- [ ] keep measurements when resizing
- [ ] XHR handler for server

BUGS:


MVP:

- save workspace online

After validating:

- remote renderer
