const WINDOW_WIDTH  = 1366;
const WINDOW_HEIGHT = 768;
const WINDOW_PADDING = 10;

const startMaster = (entryHashes: string[]) => {
  openEntryWindows(entryHashes);
}

const openEntryWindows = (entryHashes: string[]) => {
  const urls = entryHashes.map(getHashIndexUrl);
  const windows = [];

  let previousWindowLeft = 0;

  for (const url of urls) {
    const window = open(url);
    window.moveTo(previousWindowLeft, 0);
    window.resizeTo(WINDOW_WIDTH, WINDOW_HEIGHT);
    previousWindowLeft += WINDOW_WIDTH + WINDOW_PADDING;
  } 

  return windows;
}

const getHashIndexUrl = (hash: string) => `${location.protocol}//${location.host}/${hash}.html`;