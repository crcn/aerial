import { Dependency } from "../dependency-graph";
import { SandboxModule } from "../sandbox";
import { ISourcePosition, ISerializer, IWalkable, sourcePositionEquals } from "aerial-common";

let _i = 0;


const seed = Math.round(Math.random() * 100);

export function generateSyntheticUID() {

  // TODO - add seed & platform information here
  return "" + seed + "." + _i++;
}

/**
 * Information about where a synthetic object came from.
 *
 * @export
 * @interface ISyntheticSourceInfo
 */

export interface ISyntheticSourceInfo {

  /**
   * The source AST expression kind.
   *
   * @type {*}
   */

  kind?: any;

  /**
   * Source file of the synthetic object expression.
   *
   * @type {string}
   */

  uri: string;

  /**
   * Start AST expression position (necessary for edits).
   *
   * @type {ISourcePosition}
   */

  start?: ISourcePosition;

  /**
   * End position of the AST expression.
   *
   * @type {ISourcePosition}
   */

  end?: ISourcePosition;
}

export function syntheticSourceInfoEquals(a: ISyntheticSourceInfo, b: ISyntheticSourceInfo) {
  return (a == null && b == null) || (a && b && a.kind === b.kind && a.uri === b.uri && sourcePositionEquals(a.start, b.start) && sourcePositionEquals(a.end, b.end));
}

/**
 * Synthetic objects are created at runtime typically by an interpreter, or an emulated environment.
 *
 * @export
 * @interface ISynthetic
 */

export interface ISyntheticObject extends IWalkable {

  /**
   * Internal property. See below for docs
   */

  $source?: ISyntheticSourceInfo;

  /**
   * Internal
   */

  $uid: any;

  /**
   * The unique ID of the synthetic object
   * @type {ISyntheticSourceInfo}
   */

  readonly uid: any;

  /**
   * Expression & file source of the synthetic object. Added at runtime by either a) an AST interpreter,
   * or b) a transpiled script that injects this property where a synthetic object is created. For example:
   *
   * const element = document.createElement("div");
   *
   * May be transpiled to:
   *
   * const element = document.createElement("div"); // SyntheticElement
   * element.$source = { kind: 'functionCall' uri: './script.js', start: { line: 2, column: 1 }};
   */

  readonly source?: ISyntheticSourceInfo;

  /**
   * Creates an identical copy of the synthetic object.
   *
   * @param {boolean} [deep] when omitted or FALSE, creates a shallow copy of the synthetic object. When TRUE,
   * creates a copy of the synthetic object and all of its synthetic children.
   * @returns {ISynthetic}
   */

  clone(deep?: boolean): ISyntheticObject;
}

export interface ISerializedSyntheticObject {
  source: ISyntheticSourceInfo;
  uid: any;
}

/**
 * Converts the synthetic object into a format that can be transfered over a network.
 */

export class SyntheticObjectSerializer implements ISerializer<ISyntheticObject, any[]> {
  constructor(readonly childSerializer: ISerializer<ISyntheticObject, any>) { }
  serialize(value: ISyntheticObject) {
    const source  = value.$source && [
      value.$source.uri, 
      value.$source.kind, 
      value.$source.start.line, 
      value.$source.start.column, 
      value.$source.end && value.$source.end.line, 
      value.$source.end && value.$source.end.column, 
    ] || [];
    return [this.childSerializer.serialize(value), source, value.$uid];
  }
  deserialize([child, [uri, kind, sline, scolumn, eline, ecolumn], uid], kernel, ctor) {
    const obj = this.childSerializer.deserialize(child, kernel, ctor);
    obj.$source = sline && {
      uri: uri,
      kind: kind,
      start: {
        line: sline,
        column: scolumn
      },
      end: eline && {
        line: eline,
        column: ecolumn
      }
    };
    obj.$uid = uid;
    return obj;
  }
}
