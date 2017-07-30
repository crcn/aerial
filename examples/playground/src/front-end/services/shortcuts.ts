import { parallel, readAll } from "mesh";
const Mousetrap = require("mousetrap");
import { 
  Action, 
  Message, 
  diffArray,
  patchArray,
  Dispatcher, 
  whenMaster,
  whenStoreChanged, 
  StoreChangedEvent,
} from "aerial-common2";

export type Shortcut = {
  keyCombo: string;
  action: Action;
}

export type ShortcutServiceState = {
  shortcuts: Shortcut[]
};

export const initShortcutsService = (upstream: Dispatcher<any>) => (downstream: Dispatcher<any>) => {

  let currentShortcuts = [];
  const mt = typeof document !== "undefined" ? Mousetrap() : undefined;

  return parallel(
    downstream,
    whenMaster(upstream, whenStoreChanged((state: ShortcutServiceState) => state.shortcuts, ({ payload: { shortcuts = [] } }: StoreChangedEvent<ShortcutServiceState>) => {
      for (const { keyCombo } of currentShortcuts) {
        mt.unbind(keyCombo);
      }

      for (const { keyCombo, action } of shortcuts) {
        mt.bind(keyCombo, (sourceEvent) => {
          sourceEvent.preventDefault();
          readAll(upstream({ ...action, sourceEvent }));
        });
      }
      currentShortcuts = shortcuts || [];
    }))
  );
}