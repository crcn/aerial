import { CoreEvent } from "./base";
import { ICloneable } from "../object";
import { serializable, serialize, deserialize } from "../serialize";

@serializable("Mutation", {
  serialize({ type, target }: Mutation<any>) {
    return [type, serialize(target && (target.clone ? target.clone(false) : target))];
  },
  deserialize([ type, target ], kernel): Mutation<any> {
    return new Mutation(
      type,
      deserialize(target, kernel)
    );
  }
})
export class Mutation<T> {
  constructor(readonly type: string, readonly target?: T) {
  }
  toString() {
    return `${this.constructor.name}(${this.paramsToString()})`;
  }
  protected paramsToString() {

    // target is omitted here since you can inspect the *actual* target by providing an "each" function
    // for the synthetic object editor, and logging the target object there.
    return `${this.type}`;
  }

  toEvent(bubbles?: boolean) {
    return new MutationEvent(this, bubbles);
  }
}

export class MutationEvent<T> extends CoreEvent {
  static readonly MUTATION = "mutation";
  constructor(readonly mutation: Mutation<T>, bubbles?: boolean) {
    super(MutationEvent.MUTATION, bubbles);
  }
}

@serializable("SetValueMutation", {
  serialize({ type, target, newValue }: SetValueMutation<any>) {
    return [type, serialize(target.clone(false)), newValue];
  },
  deserialize([ type, target, newValue ], kernel): SetValueMutation<any> {
    return new SetValueMutation(
      type,
      deserialize(target, kernel),
      newValue
    );
  }
})
export class SetValueMutation<T> extends Mutation<T> {
  constructor(type: string, target: T, public newValue: any) {
    super(type, target);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.newValue}`;
  }
}


export abstract class ChildMutation<T, U extends ICloneable> extends Mutation<T> {
  constructor(type: string, target: T, readonly child: U, readonly index: number) {
    super(type, target);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.child.toString().replace(/[\n\r\s\t]+/g, " ")}`;
  }
}

// TODO - change index to newIndex 
@serializable("InsertChildMutation", {
  serialize({ type, target, child, index }: InsertChildMutation<ICloneable, any>) {
    return [type, serialize(target.clone(false)), serialize(child), index]
  },
  deserialize([ type, target, child, index ], kernel): InsertChildMutation<any, any> {
    return new InsertChildMutation(
      type,
      deserialize(target, kernel),
      deserialize(child, kernel),
      index
    );
  }
})
export class InsertChildMutation<T extends ICloneable, U extends ICloneable> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, index: number = Number.MAX_SAFE_INTEGER) {
    super(type, target, child, index);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
  }
}

@serializable("RemoveChildMutation", {
  serialize({ type, target, child, index }: RemoveChildMutation<ICloneable, any>) {
    return [type, serialize(target.clone(false)), serialize(child.clone(false)), index];
  },
  deserialize([ type, target, child, index ], kernel): RemoveChildMutation<any, any> {
    return new RemoveChildMutation(
      type,
      deserialize(target, kernel),
      deserialize(child, kernel),
      index
    );
  }
})
export class RemoveChildMutation<T extends ICloneable, U extends ICloneable> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, index: number) {
    super(type, target, child, index);
  }
}

@serializable("PropertyMutation", {
  serialize({ type, target, name, newValue, oldValue, oldName, index }: PropertyMutation<ICloneable>) {
    return [
      type, 
      serialize(target.clone ? target.clone(false) : target), 
      name, 
      serialize(newValue),
      serialize(oldValue),
      oldName, 
    index];    
  },
  deserialize([ type, target, name, newValue, oldValue, oldName, index ], kernel): PropertyMutation<any> {
    return new PropertyMutation(
      type,
      deserialize(target, kernel),
      name,
      deserialize(newValue, kernel),
      deserialize(oldValue, kernel),
      oldName,
      index
    );
  }
})
export class PropertyMutation<T> extends Mutation<T> {
  static readonly PROPERTY_CHANGE = "propertyChange";
  
  constructor(type: string, target: T, public  name: string, public newValue: any, public oldValue?: any, public oldName?: string, public index?: number) {
    super(type, target);
  }

  toEvent(bubbles: boolean = false) {
    return new MutationEvent(this, bubbles);
  }

  paramsToString() {
    return `${super.paramsToString()}, ${this.name}, ${this.newValue}`;
  }
}

/**
 * Removes the target synthetic object
 */

export class RemoveMutation<T> extends Mutation<T> {
  static readonly REMOVE_CHANGE = "removeChange";
  constructor(target?: T) {
    super(RemoveMutation.REMOVE_CHANGE, target);
  }
}

// TODO - change oldIndex to index, and index to newIndex
@serializable("MoveChildMutation", {
  serialize({ type, target, child, index, oldIndex }: MoveChildMutation<any, any>) {
    return [type, serialize(target), serialize(child.clone(false)), oldIndex, index];
  },
  deserialize([ type, target, child, index, oldIndex ], kernel): MoveChildMutation<any, any> {
    return new MoveChildMutation(
      type,
      deserialize(target, kernel),
      deserialize(child, kernel),
      oldIndex,
      index
    );
  }
})
export class MoveChildMutation<T, U extends ICloneable> extends ChildMutation<T, U> {
  constructor(type: string, target: T, child: U, readonly oldIndex: number, index: number) {
    super(type, target, child, index);
  }
  paramsToString() {
    return `${super.paramsToString()}, ${this.index}`;
  }
}
