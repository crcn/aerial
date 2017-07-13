import { tee } from "mesh";

export const detached = (fn: Function) => (...args) => {
  const [spare, primary] = tee(fn(...args));
  spare.next(); // kickoff
  return primary;
};