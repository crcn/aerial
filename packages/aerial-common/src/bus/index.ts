export type Message = {
  type: string;
}

export type Dispatcher = (message: Message) => any;