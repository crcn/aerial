HI PRIO:

- [ ] javascript
- [ ] ability to open external window
- [ ] watch dependencies that are dynamically loaded in
- [ ] use DOM mutation API to listen for changes
- [ ] rendering engine based on DOM mutation API

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