import { Dispatcher } from "../bus";
import { remote, parallel, when } from "mesh";

let loadedScripts;
let lastScriptSrc;

export const isMaster = typeof window !== "undefined";

if (isMaster) {
  loadedScripts = document.querySelectorAll("script");
  lastScriptSrc = loadedScripts.length && loadedScripts[loadedScripts.length - 1].src;
}

const workers = [];
const threadedFunctions = [];
const jobPromises = {};
let currentWorkerIndex = 0;
let cid = 0;

function getNextWorker(): Worker {
  return workers.length ? workers[currentWorkerIndex = (currentWorkerIndex + 1) % workers.length] : undefined;
}

function worker(worker: any, upstream: Dispatcher<any>): Dispatcher<any> {
  return remote(async () => ({
    adapter: {
      send(message) {
        worker.postMessage(message);
      },
      addListener(listener) {
        worker.addEventListener("message", (message: MessageEvent) => {
          listener(message.data);
        });
      }
    }
  }), upstream);
}

/**
 */

export const fork = (upstream: Dispatcher<any>, pathName?: string, argv?: any[], env?: any) => {
  return worker(new Worker(pathName || lastScriptSrc), upstream);
}

/**
 */

export const hook = (upstream: Dispatcher<any>) => {
  return worker(self, upstream);
}

// TODO - do not access global here -- need to get from state
export const whenMaster = (_then: Dispatcher<any>, _else?: Dispatcher<any>) => when(() => isMaster, _then, _else);
export const whenWorker = (_then: Dispatcher<any>, _else?: Dispatcher<any>) => when(() => !isMaster, _then, _else);

/**
 *
 */

if (isMaster) {

  const KILL_TIMEOUT = 1000 * 60 * 5; // 5 minute

  // worker cleanup
  setInterval(() => {
    for (let cid in jobPromises) {
      const promise = jobPromises[cid];

      // may have been deleted -- waiting for GC to kick in
      if (!promise) continue;

      if (promise.timestamp < Date.now() - KILL_TIMEOUT) {
        console.warn(`Killing zombie job: ${cid}`);

        // return Timeout error
        jobPromises[cid] = undefined;
        promise.reject(new Error(`Timeout`));
      }
    }
  }, 1000 * 10);
} else if (typeof self !== "undefined") {
  self.addEventListener("message", async function(message: MessageEvent) {

    const { cid, index, args } = message.data;
    const fn = threadedFunctions[index];

    function resolve(data) {
      self.postMessage({ cid, data }, undefined);
    }

    function reject(data) {
      self.postMessage({ cid, data, error: true }, undefined);
    }

    try {
      resolve(fn(...args));
    } catch (e) { reject({ message: e.message }); }
  });
}