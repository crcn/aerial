IMMEDIATE:

- [ ] socket.io sync watched files
- [ ] render preview of components

ALL TODOS:

- [ ] root /
  - [ ] scan for all target files (*.pc) and listen for any
new ones that are added
  - [ ] plaground UI extensions
    - [ ] device size checkboxes
  - [ ] save settings to local storage
  - [ ] call `window.open` for each local file -- manage layout
- [ ] /file/:relativePath 
  - [ ] needs to listen for target path for any changes
  - [ ] Use DG strategy to load resources (or maybe systemjs) -- needs to be encapsulated
  - [ ] parser needs to attach expression information to each node
- [ ] file change events should send content diffs