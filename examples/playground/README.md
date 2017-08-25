very simple online playground for visually creating web applications

GOALS:

- [ ] UX similar to regular browsers
  - [ ] right click inspect element (source code though)

IMMEDIATE:

- [ ] vscode extension

MVP:

- [ ] HMR support in windows
- [ ] dev server for playground (window that manages all other windows)
- [ ] DSL for dynamic templates

- POLISH:

- [ ] keyboard shortcuts by browser - http://dmcritchie.mvps.org/firefox/keyboard.htm
   - [ ] ctrl+shift+{} to tab between windows
- [ ] alt+click of tabbed item in full screen mode should respect original window size
- [ ] tab between windows (cmd+shift+{)
- [ ] zoom indicator
- [ ] measurement tooling
- [ ] highlight elements based on text cursor position
- [ ] multi select
- [ ] copy + paste elements
- [ ] meta keywords for controlling UI
  - [ ] `<meta name="no-tools" />`
  - [ ] `<meta name="device=ios5" />`
- [ ] AWS lambda for rendering

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
