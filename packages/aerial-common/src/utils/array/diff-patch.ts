import { Mutation } from "../../messages/mutate";

export namespace ArrayItemMutationTypes {
  export const INSERT = "insert";
  export const UPDATE = "update";
  export const DELETE = "delete";
}

export abstract class ArraItemMutation<T> extends Mutation<T> {
  constructor(type: string) {
    super(type);
  }
  abstract accept(visitor: IArrayMutationVisitor<T>);
}

export class ArrayInsertMutation<T>  extends ArraItemMutation<T> {
  constructor(readonly index: number, readonly value: T) {
    super(ArrayItemMutationTypes.INSERT);
  }
  accept(visitor: IArrayMutationVisitor<T>) {
    return visitor.visitInsert(this);
  }
}

export class ArrayRemoveMutation extends ArraItemMutation<any> {
  constructor(readonly value: any, readonly index: number) {
    super(ArrayItemMutationTypes.DELETE);
  }
  accept(visitor: IArrayMutationVisitor<any>) {
    return visitor.visitRemove(this);
  }
}

export class ArrayUpdateMutation<T> extends ArraItemMutation<T> {
  constructor(readonly originalOldIndex: number, readonly patchedOldIndex: number, readonly newValue: T, readonly index: number) {
    super(ArrayItemMutationTypes.UPDATE);
  }
  accept(visitor: IArrayMutationVisitor<T>) {
    return visitor.visitUpdate(this);
  }
}

export interface IArrayMutationVisitor<T> {
  visitRemove(del: ArrayRemoveMutation);
  visitInsert(insert: ArrayInsertMutation<T>);
  visitUpdate(update: ArrayUpdateMutation<T>);
}

export class ArrayMutation<T> extends Mutation<T> {

  static readonly ARRAY_DIFF = "arrayDiff";

  readonly count: number;

  constructor(
    readonly mutations: ArraItemMutation<T>[],
  ) {
    super(ArrayMutation.ARRAY_DIFF);
    this.count = mutations.length;
  }

  accept(visitor: IArrayMutationVisitor<T>) {
    return Promise.all(this.mutations.map(change => change.accept(visitor)));
  }
}

export function diffArray<T>(oldArray: Array<T>, newArray: Array<T>, countDiffs: (a: T, b: T) => number): ArrayMutation<T> {

  // model used to figure out the proper mutation indices
  const model    = [].concat(oldArray);

  // remaining old values to be matched with new values. Remainders get deleted.
  const oldPool  = [].concat(oldArray);

  // remaining new values. Remainders get inserted.
  const newPool  = [].concat(newArray);

  const mutations: ArraItemMutation<any>[] = [];
  let   matches: Array<[T, T]>           = [];

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
    mutations.push(new ArrayRemoveMutation(oldValue, index));
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
      mutations.push(new ArrayInsertMutation(newIndex, newValue));
      model.splice(newIndex, 0, newValue);
    // updated
    } else {
      const oldIndex = model.indexOf(oldValue);
      mutations.push(new ArrayUpdateMutation(oldArray.indexOf(oldValue), oldIndex, newValue, newIndex));
      if (oldIndex !== newIndex) {
        model.splice(oldIndex, 1);
        model.splice(newIndex, 0, oldValue);
      }
    }
  }

  return new ArrayMutation<any>(mutations);
}

export function patchArray<T>(target: Array<T>, diff: ArrayMutation<T>, mapUpdate: (a: T, b: T) => T, mapInsert?: (b: T) => T) {
  diff.accept({
    visitInsert({ index, value }) {
      target.splice(index, 0, mapInsert(value));
    },
    visitRemove({ index }) {
      target.splice(index, 1);
    },
    visitUpdate({ patchedOldIndex, newValue, index }) {
      const oldValue     = target[patchedOldIndex];
      const patchedValue = mapUpdate(oldValue, newValue);
      if (patchedValue !== oldValue || patchedOldIndex !== index) {
        if (patchedOldIndex !== index) {
          target.splice(patchedOldIndex, 1);
        }
        target.splice(index, 0, patchedValue);
      }
    }
  });
}