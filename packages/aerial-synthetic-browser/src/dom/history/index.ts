import Url = require("url");
import { Observable, PropertyWatcher, bindable } from "aerial-common";
import { SyntheticLocation } from "../../location";

export class SyntheticHistory extends Observable {

  @bindable()
  public $location: SyntheticLocation;
  public $locationWatcher: PropertyWatcher<SyntheticHistory, SyntheticLocation>;
  
  private _states: Array<[any, string, string]>;
  private _index: number;

  constructor(url: string) {
    super();
    this._index = 0;
    this._states = [[{}, undefined, url]];
    this.$location = new SyntheticLocation(url);
    this.$locationWatcher = new PropertyWatcher<SyntheticHistory, SyntheticLocation>(this, "$location");
  }

  get state() {
    return this._states[this._index][0];
  }

  back() {
    this.go(--this._index);
  }

  forward() {
    this.go(++this._index);
  }
  
  go(index) {
    this._index = index;
    this._redirect(this._states[index][2])
  }

  get length() {
    return this._states.length;
  }

  pushState(state: any, title: string, url: string) {
    this._states.push([state, title, url]);
    this._index = this.length - 1;
    this._redirect(url);
  }

  replaceState(state: any, title: string, url: string) {
    this._states[this.length - 1] = [state, title, url];
    this._index = this.length - 1;
    this._redirect(url);
  }

  private _redirect(url: string) {
    const newLocation = this.$location.clone();
    newLocation.$redirect(url);

    this.$location = newLocation;
  }
}