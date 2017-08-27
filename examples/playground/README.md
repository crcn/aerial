very simple online playground for visually creating web applications

GOALS:

- [ ] UX similar to regular browsers
  - [ ] right click inspect element (source code though)
- [ ] built extensions API for windows to hook into
- [ ] developing a language that is optimial for visual development, not hand writing.
  - [ ] visual first, hand-writing second. 

NON-GOALS:

- [ ] to cover 100% of UI design & development
- [ ] to attract people with _no_ knowledge of HTML & CSS.

- POLISH:

- [ ] shift key resize should be activated anytime the user is dragging a resizer
- [ ] ability to to open window outside of Playground
- [ ] keyboard shortcuts by browser - http://dmcritchie.mvps.org/firefox/keyboard.htm
   - [ ] ctrl+shift+{} to tab between windows
- [ ] tab between windows (cmd+shift+{)
- [ ] zoom indicator
- [ ] measurement tooling
- [ ] highlight elements based on text cursor position
- [ ] multi select
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
- [ ] cannot multi dnd windows
- [ ] secondary selection (double click) should reselect item that was clicked
- [ ] use old DOM rendering code
- [ ] synthetic window timers
- [ ] HMR directly in window
- [ ] resizing elements
- [ ] keep measurements when resizing

Immediate TODOS:

UIs:

- [ ] 

MVP:

- save workspace online

After validating:

- remote renderer
