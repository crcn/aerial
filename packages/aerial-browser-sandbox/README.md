HI PRIO:

- [ ] element class prototype can be manipulated without persisting to next session
- [ ] watch dependencies that are dynamically loaded in

LITMUS:

- [ ] run all TODOMVC examples



```javascirpt

let loadedUris = [];
function*() {
  const window = new SyntheticEnvWindow();
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