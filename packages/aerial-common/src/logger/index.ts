import { IDispatcher } from "@tandem/mesh";
import { LogLevel } from "./levels";
import { CoreEvent } from "../messages";

export class LogEvent extends CoreEvent {
  static readonly LOG        = "log";
  constructor(readonly level: number, readonly text: string, readonly filterable?: boolean) {
    super(LogEvent.LOG);
  }
}

export class LogTimer {
  private _startTime: number;
  private _interval: any;

  constructor(readonly logger: Logger, readonly intervalMessage?: string, readonly timeout?: number, public level: LogLevel = LogLevel.INFO) {
    this._startTime = Date.now();

    if (intervalMessage && timeout && !process.env.TESTING) {
      this._interval = setInterval(() => {
        this.logTime(intervalMessage);
      }, timeout);
    }
  }

  stop(message?: string) {
    clearInterval(this._interval);
    this.logTime(message || "completed");
  }

  private logTime(message: string) {
    this.logger.log(this.level, `${message} %ss`, ((Date.now() - this._startTime) / 1000).toFixed(0));
  }
}

export class Logger {

  public generatePrefix: () => string;
  public filterable: boolean;

  constructor(public bus: IDispatcher<any, any>, public prefix: string = "", private _parent?: Logger) { }

  createChild(prefix: string = "") {
    return new Logger(this.bus, prefix, this);
  }

  /**
   * Extra noisy logs which aren't very necessary
   */

  debug(text: string, ...rest) {
    this._log(LogLevel.DEBUG, text, ...rest);
  }

  /**
   * @deprecated. Use verbose.
   * General logging information to help with debugging
   */

  log(level: LogLevel, text: string, ...rest) {
    this._log(level, text, ...rest);
  }

  /**
   * log which should grab the attention of the reader
   */

  info(text: string, ...rest) {
    this._log(LogLevel.INFO, text, ...rest);
  }

  warn(text: string, ...rest) {
    this._log(LogLevel.WARNING, text, ...rest);
  }

  error(text: string, ...rest) {
    this._log(LogLevel.ERROR, text, ...rest);
  }

  startTimer(timeoutMessage?: string, interval: number = 5000, logLevel?: LogLevel) {
    return new LogTimer(this, timeoutMessage, interval, logLevel);
  }

  private getPrefix() {
    let prefix = this.generatePrefix && this.generatePrefix() || this.prefix;

    if (this._parent) {
      prefix = this._parent.getPrefix() + prefix;
    }
    return prefix;
  }

  _log(level: number, text: string, ...params: Array<any>) {


    function stringify(value) {
      if (typeof value === "object") {
        value = JSON.stringify(value, null, 2);
      }
      return value;
    }

    text = stringify(text);

    const paramCount = (String(text).match(/%(d|s)/g) || []).length;
    const sprintfParams = params.slice(0, paramCount);
    const restParams    = params.slice(paramCount);

    let message = [sprintf(
      `${this.getPrefix()}${text}`,
      ...sprintfParams.map(stringify)
    ), ...restParams].join(" ");
    this.bus.dispatch(new LogEvent(level, message, this.filterable));
  }

}

function sprintf(text: string, ...params: any[]) {
  for (const param of params) {
    text = text.replace(/%\w/, param);
  }
  return text;
}


export * from "./levels";