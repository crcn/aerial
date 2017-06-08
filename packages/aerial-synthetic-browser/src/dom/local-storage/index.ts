export class SyntheticLocalStorage {
  constructor(private _data: Map<string, string> = new Map()) {

  }

  get length() {
    return this._data.size;
  }

  getItem(key) {

    // note that null is parsable here -- important to ensure that operations such as JSON.parse work
    return this._data.get(key) || null;
  }

  setItem(key: string, value: string) {
    this._data.set(key, value);
  }

  removeItem(key: string) {
    this._data.delete(key);
  }

  clear() {
    this._data.clear();
  }

  key(index: number) {
    return this._data.keys[index];
  }
}