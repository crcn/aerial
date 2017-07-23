import { Struct } from "../struct";

export type DSCollectionInfo<TValueSchema extends Struct> = {
  name: string;
  valueSchema: TValueSchema;
}