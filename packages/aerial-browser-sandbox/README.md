HI PRIO:

- [ ] javascript
- [ ] ability to open external window
- [ ] html ast
- [ ] change urls to point to proxy
- [ ] flesh out parent-node
- [ ] change *Interface to Interface

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