import { SyntheticEnvWindow } from "./window";

export class SyntheticEnvDocument /* implements Document */ {
  constructor(readonly defaultView:  SyntheticEnvWindow) {
    
  }
}