
import { serializable, serialize, deserialize } from "../serialize";

@serializable("Status", {
  serialize({ type, data }: Status) {
    return { type, data: serialize(data) };
  },
  deserialize({ type, data }, kernel): Status {
    return new Status(type, deserialize(data, kernel));
  }
})
export class Status {
  static readonly IDLE: string = "idle";
  static readonly ERROR: string = "error";
  static readonly LOADING: string = "loading";
  static readonly COMPLETED: string = "completed";
  constructor(readonly type: string, readonly data?: any) { }
  clone() {
    return new Status(this.type, this.data);
  }
}
