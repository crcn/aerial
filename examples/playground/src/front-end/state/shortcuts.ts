import { Action } from "aerial-common2";

export type Shortcut = {
  keyCombo: string;
  action: Action;
}

export type ShortcutServiceState = {
  shortcuts: Shortcut[]
};


export const createKeyboardShortcut = (keyCombo: string, action: Action): Shortcut => ({
  keyCombo,
  action
})