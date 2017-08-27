very simple online playground for visually creating web applications

GOALS:

- [ ] UX similar to regular browsers
  - [ ] right click inspect element (source code though)
- [ ] built extensions API for windows to hook into
- [ ] developing a language that is optimial for visual development, not hand writing.
  - [ ] visual first, hand-writing second. 

INSPIRATION:

- [ ] what does the future of FE dev look like?

NON-GOALS:

- [ ] to cover 100% of UI design & development
- [ ] to attract people with _no_ knowledge of HTML & CSS.

- POLISH:

- [ ] ability to to open window outside of Playground
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

HI PRIO:

- [ ] move style to class shortcut
- [ ] CSS inspector

CLEANUP:

- [ ] file cache namespaced to workspace
- [ ] normalize urls - http://site.com/ -> http://site.com
- [ ] cannot multi dnd windowsx
- [ ] use old DOM rendering code
- [ ] synthetic window timers
- [ ] resizing elements
- [ ] keep measurements when resizing

BUGS:

- [ ] cannot delete window in full screen mode then shift to another window

UIs:

- [ ] 

MVP:

- save workspace online

After validating:

- remote renderer
