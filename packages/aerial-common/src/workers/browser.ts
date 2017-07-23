import { IBus, RemoteBus, filterFamilyMessage } from "mesh7";
import { serialize, deserialize } from "../serialize";
import { CoreEvent } from "../messages";

let loadedScripts;
let lastScriptSrc;

export const isMaster = typeof window !== "undefined";

if (isMaster) {
  loadedScripts = document.querySelectorAll("script");
  lastScriptSrc = loadedScripts.length && loadedScripts[loadedScripts.length - 1].src;
}

export class Serializer<T> {
  public name: string;
  constructor(
    clazz: Function,
    readonly serialize: (value: T) => Object,
    readonly deserialize: (value: Object) => T
  ) {
    this.name = clazz.name;
  }
}

const workers = [];
const threadedFunctions = [];
const jobPromises = {};
let currentWorkerIndex = 0;
let cid = 0;

function getNextWorker(): Worker {
  return workers.length ? workers[currentWorkerIndex = (currentWorkerIndex + 1) % workers.length] : undefined;
}

function createWorkerBus(family: string, worker: any, localBus: IBus<any, any>): IBus<any, any> {
  return new RemoteBus({
    family: family,
    testMessage: filterFamilyMessage,
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
  }, localBus, { serialize, deserialize })
}

/**
 */

export function fork(family: string, localBus: IBus<any, any>, pathName?: string, argv?: any[], env?: any) {
  return createWorkerBus(family, new Worker(pathName || lastScriptSrc), localBus);
}

/**
 */

export function hook(family, localBus: IBus<any, any>) {
  return createWorkerBus(family, self, localBus);
}

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