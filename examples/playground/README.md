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

- [ ] alt+click of tabbed item should respect original window size
- [ ] auto-layout windows
- [ ] clean up edit text input so that it doesn't have dragger
- [ ] renderer needs to use iframe so that it can listen for resize
- [ ] scrollbars should work in fullscreen mode
- [ ] tab between windows (cmd+shift+{)
- [ ] react motion for moving into full screen mode
- [ ] ctrl+f for full screen window
- [ ] +/- to zoom
- [ ] zoom indicator
- [ ] measurement tooling
- [ ] multi select
- [ ] copy + paste elements
- [ ] meta keywords for controlling UI
  - [ ] `<meta name="no-tools" />`
  - [ ] `<meta name="device=ios5" />`
- [ ] AWS lambda for rendering

HI PRIO:

- [ ] DND working for everything (must be tested)
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
