import { when } from "mesh";

export type Message = {
  type: string;
}

export const createMessage = (type: string, rest: any = {}): Message => ({
  ...rest,
  type,
});

export type Dispatcher<T extends Message> = (message: T) => any;

export const whenType = (type: string, _then?: Dispatcher<any>, _else?: Dispatcher<any>) => when((m: Message) => m.type === type, _then, _else);