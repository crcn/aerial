HI PRIO:

- [ ] element class prototype can be manipulated without persisting to next session
- [ ] watch dependencies that are dynamically loaded in

LITMUS:

- [ ] run all TODOMVC examples



```javascirpt

function*() {
  const window = new SyntheticEnvWindow();
  yield fork(window.saga);
  yield fork(window.open, "http://google.com");
  const loadedUris = window.$network.loadedUris;
}
```