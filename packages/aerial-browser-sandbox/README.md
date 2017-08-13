HI PRIO:

- [ ] css attributes for selected elements
- [ ] sync text editor changes to file cache
- [ ] html ast
- [ ] change urls to point to proxy
- [ ] flesh out parent-node

DEMO:

- [ ] sync changes between windows
- [ ] open & control window
- [ ] user interactions
- [ ] store all application state in memory

LOW PRIO:

- [ ] ability to open & control external window
- [ ] change urls to point to proxy
- [ ] same diff / patch algorithms for synthetic browser

LITMUS:

- [ ] run all TODOMVC examples

```javascirpt

let loadedUris = [];
function*() {
  const window = new SEnvWindow();
  yield fork(window.saga);
  yield fork(window.open, "http://google.com");

  // need to combine all loaded URIs from all windows.
  eachDiff(
    diffArray(loadedUris, window.$network.loadedUris),
    function insert(uri) {
      // watch uri
    },
    function delete(uri) {
      // unwatch URI
    }
  );

  loadedUris = window.$network.loadedUris;
}
```

```javascript

```