very simple online playground for visually creating web applications

TOMORROW:

- [ ] preview server
  - [ ] auto layout windows
  - [ ] windows should be immovable
  - [ ] reload main window when a file is added
- [ ] close child windows

MVP:

- [ ] HMR support in windows
- [ ] dev server for playground (window that manages all other windows)

- POLISH:

- [ ] keyboard shortcuts by browser - http://dmcritchie.mvps.org/firefox/keyboard.htm
   - [ ] ctrl+t to open new window
   - [ ] ctrl+click to open link in new window
   - [ ] ctrl+shift+{} to tab between windows
- [ ] load spinner for each window
- [ ] scroll position should respect scroll height of entire document (compute with mounted iframe window height)
- [ ] renderer needs to use iframe so that it can listen for resize
- [ ] alt+click of tabbed item in full screen mode should respect original window size
- [ ] clean up edit text input so that it doesn't have dragger
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

- [ ] files tab automatically populates from windows

UIs:

- [ ] 

MVP:

- save workspace online

After validating:

- remote renderer
