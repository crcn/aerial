import { struct } from "../struct";
import { Mutation } from "../mutate";

export const ARRAY_DIFF   = "ARRAY_DIFF";
export const ARRAY_INSERT = "ARRAY_INSERT";
export const ARRAY_UPDATE = "ARRAY_UPDATE";
export const ARRAY_DELETE = "ARRAY_DELETE";


export type ArrayValueMutation<T> = Mutation<any>;

export type ArrayInsertMutation<T> = {
  index: number,
  value: T
} & ArrayValueMutation<any>;

export type ArrayDeleteMutation<T> = {
  index: number;
  value: T;
} & ArrayValueMutation<T>;

export type ArrayUpdateMutation<T> = {
  originalOldIndex: number;
  patchedOldIndex: number;
  newValue: T;
  index: number;
} & ArrayValueMutation<any>;


export type ArrayMutation<T> = {
  mutations: ArrayValueMutation<T>[]
} & Mutation<T>;

export const createArrayInsertMutation = <T>(index: number, value: T): ArrayInsertMutation<T> => struct(ARRAY_INSERT, {
  index,
  value,
});

export const createArrayUpdateMutation = <T>(originalOldIndex: number, patchedOldIndex: number, newValue: T, index: number): ArrayUpdateMutation<T> => struct(ARRAY_UPDATE, {
  index,
  newValue,
  originalOldIndex,
  patchedOldIndex,
});

export const createArrayDeleteMutation = <T>(value: T, index: number): ArrayDeleteMutation<T> => struct(ARRAY_DELETE, {
  value,
  index
});

export const createArrayMutation = <T>(mutations: ArrayValueMutation<T>[]): ArrayMutation<T> => struct(ARRAY_DIFF, {
  mutations
});

export function diffArray<T>(oldArray: Array<T>, newArray: Array<T>, countDiffs: (a: T, b: T) => number): ArrayMutation<T> {

  // model used to figure out the proper mutation indices
  const model    = [].concat(oldArray);

  // remaining old values to be matched with new values. Remainders get deleted.
  const oldPool  = [].concat(oldArray);

  // remaining new values. Remainders get inserted.
  const newPool  = [].concat(newArray);

  const mutations: ArrayValueMutation<T>[] = [];
  let   matches: Array<[T, T]>             = [];

  for (let i = 0, n = oldPool.length; i < n; i++) {

    const oldValue = oldPool[i];
    let bestNewValue;

    let fewestDiffCount = Infinity;

    // there may be multiple matches, so look for the best one
    for (let j = 0, n2 = newPool.length; j < n2; j++) {

      const newValue   = newPool[j];

      // -1 = no match, 0 = no change, > 0 = num diffs
      let diffCount = countDiffs(oldValue, newValue);

      if (~diffCount && diffCount < fewestDiffCount) {
        bestNewValue    = newValue;
        fewestDiffCount = diffCount;
      }

      // 0 = exact match, so break here.
      if (fewestDiffCount === 0) break;
    }

    // subtract matches from both old & new pools and store
    // them for later use
    if (bestNewValue != null) {
      oldPool.splice(i--, 1);
      n--;
      newPool.splice(newPool.indexOf(bestNewValue), 1);

      // need to manually set array indice here to ensure that the order
      // of operations is correct when mutating the target array.
      matches[newArray.indexOf(bestNewValue)] = [oldValue, bestNewValue];
    }
  }

  for (let i = oldPool.length; i--;) {
    const oldValue  = oldPool[i];
    const index     = oldArray.indexOf(oldValue);
    mutations.push(createArrayDeleteMutation(oldValue, index));
    model.splice(index, 1);
  }

  // sneak the inserts into the matches so that they're
  // ordered propertly along with the updates - particularly moves.
  for (let i = 0, n = newPool.length; i < n; i++) {
    const newValue = newPool[i];
    const index    = newArray.indexOf(newValue);
    matches[index] = [undefined, newValue];
  }

  // apply updates last using indicies from the old array model. This ensures
  // that mutations are properly applied to whatever target array.
  for (let i = 0, n = matches.length; i < n; i++) {
    const match = matches[i];

    // there will be empty values since we're manually setting indices on the array above
    if (match == null) continue;

    const [oldValue, newValue] = matches[i];
    const newIndex = i;

    // insert
    if (oldValue == null) {
      mutations.push(createArrayInsertMutation(newIndex, newValue));
      model.splice(newIndex, 0, newValue);
    // updated
    } else {
      const oldIndex = model.indexOf(oldValue);
      mutations.push(createArrayUpdateMutation(oldArray.indexOf(oldValue), oldIndex, newValue, newIndex));
      if (oldIndex !== newIndex) {
        model.splice(oldIndex, 1);
        model.splice(newIndex, 0, oldValue);
      }
    }
  }

  return createArrayMutation(mutations);
}

export type ArrayValueMutationHandlers<T> = {
  insert(mutation: ArrayInsertMutation<T>);
  delete(mutation: ArrayDeleteMutation<T>);
  update(mutation: ArrayUpdateMutation<T>);
}

export const eachArrayValueMutation = <T>(diff: ArrayMutation<T>, handlers: ArrayValueMutationHandlers<T>) => {
  diff.mutations.forEach((mutation) => {
    switch(mutation.$$type) {
      case ARRAY_INSERT: return handlers.insert(mutation as ArrayInsertMutation<T>);
      case ARRAY_DELETE: return handlers.delete(mutation as ArrayDeleteMutation<T>);
      case ARRAY_UPDATE: return handlers.update(mutation as ArrayUpdateMutation<T>);
    }
  })
};

export function patchArray<T>(target: Array<T>, diff: ArrayMutation<T>, mapUpdate: (a: T, b: T) => T = (a, b) => b, mapInsert: (b: T) => T = (b) => b) {
  const newTarget = [...target];

  eachArrayValueMutation(diff, {
    insert({ index, value }) {
      newTarget.splice(index, 0, mapInsert(value));
    },
    delete({ index }) {
      newTarget.splice(index, 1);
    },
    update({ patchedOldIndex, newValue, index }) {
      const oldValue     = newTarget[patchedOldIndex];
      const patchedValue = mapUpdate(oldValue, newValue);
      if (patchedValue !== oldValue || patchedOldIndex !== index) {
        if (patchedOldIndex !== index) {
          newTarget.splice(patchedOldIndex, 1);
        }
        newTarget.splice(index, 0, patchedValue);
      }
    }
  });

  return newTarget;
}