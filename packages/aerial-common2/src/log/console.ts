import chalk =  require("chalk");
import path = require("path");
import moment = require("moment");
import { titleize } from "inflection";
import { ansi_to_html } from "ansi_up";
import { whenType, Dispatcher, Message } from "../bus";
import { LogLevel, LogAction, LogActionTypes } from "./base";


function createLogColorizer(tester: RegExp, replaceValue: any) {
  return function(input: string) {
    if (!tester.test(input)) return input;
    return input.replace(tester, replaceValue);
  }
}

export type ConsoleLogConfig = {
  argv?: {
    color?: boolean,
    hlog?: boolean
  },
  log?: {
    level: LogLevel,
    prefix?: string
  }
}

const cwd = process.cwd();

const highlighters = [

  createLogColorizer(/^INF/, (match) => chalk.bgCyan(match)),
  createLogColorizer(/^ERR/, (match) => chalk.bgRed(match)),
  createLogColorizer(/^DBG/, (match) => chalk.grey.bgBlack(match)),
  createLogColorizer(/^WRN/, (match) => chalk.bgYellow(match)),

  // timestamp
  createLogColorizer(/\[\d+\.\d+\.\d+\]/, (match, inner) => `[${chalk.grey(inner)}]`),

  // URL
  createLogColorizer(/((\w{3,}\:\/\/)|([^\/\s\("':]+)?\/)([^\/\)\s"':]+\/?)+/g, (match) => {
    return chalk.yellow(/\w+:\/\//.test(match) ? match : match.replace(cwd + "/", ""))
  }),

  // duration
  createLogColorizer(/\s\d+(\.\d+)?(s|ms|m|h|d)(\s|$)/g, (match) => chalk.bold.cyan(match)),

  // numbers
  createLogColorizer(/\b\d+(\.\d+)?\b/g, (match, inner) => `${chalk.cyan(match)}`),

  // strings
  createLogColorizer(/"(.*?)"/g, (match, inner) => `"${chalk.blue(inner)}"`),

  // tokens
  createLogColorizer(/([\:\{\}",\(\)]|->|null|undefined|Infinity)/g, (match) => chalk.grey(match)),

 // <<output - green (from audio again)
  createLogColorizer(/<<(.*)/g, (match, word) => chalk.green(word)),

 // >>input - magenta (from audio)
  createLogColorizer(/>>(.*)/g, (match, word) => chalk.magenta(word)),

  // **BIG EMPHASIS**
  createLogColorizer(/\*\*(.*?)\*\*/, (match, word) => chalk.bgBlue(word)),

  // *emphasis*
  createLogColorizer(/\*(.*?)\*/g, (match, word) => chalk.bold(word)),

  // ___underline___
  createLogColorizer(/___(.*?)___/g, (match, word) => chalk.underline(word)),

  // ~de emphasis~
  createLogColorizer(/~(.*?)~/g, (match, word) => chalk.grey(word)),
];

function colorize(input: string) {
  let output = input;
  for (let i = 0, n = highlighters.length; i < n; i++) output = highlighters[i](output);
  return output;
}

function styledConsoleLog(...args: any[]) {
    var argArray = [];

    if (args.length) {
        var startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
        var endTagRe = /<\/span>/gi;

        var reResultArray;
        argArray.push(arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
        while (reResultArray = startTagRe.exec(arguments[0])) {
            argArray.push(reResultArray[2]);
            argArray.push('');
        }

        // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
        for (var j = 1; j < arguments.length; j++) {
            argArray.push(arguments[j]);
        }
    }

    console.log.apply(console, argArray);
}

// I'm against abbreviations, but it's happening here
// since all of these are the same length -- saves space in stdout, and makes
// logs easier to read.
const PREFIXES = {
  [LogLevel.DEBUG]: "DBG ",
  [LogLevel.INFO]: "INF ",
  [LogLevel.WARNING]: "WRN ",
  [LogLevel.ERROR]: "ERR ",
};


export const consoleLogger = (config: ConsoleLogConfig) => (downstreamDispatch?: Dispatcher<any>) => {
  const logConfig = config.log || { level: null, prefix: null };
  const logLevel  = logConfig.level == null ? LogLevel.ALL : logConfig.level;
  const logPrefix = logConfig.prefix || "";

  return whenType(LogActionTypes.LOG, ({ text, level }: LogAction) => {
    if (!(level & logLevel)) return;

    const log = {
      [LogLevel.DEBUG]: console.log.bind(console),
      [LogLevel.LOG]: console.log.bind(console),
      [LogLevel.INFO]: console.info.bind(console),
      [LogLevel.WARNING]: console.warn.bind(console),
      [LogLevel.ERROR]: console.error.bind(console)
    }[level];

    text = PREFIXES[level] + logPrefix + text;
    text = colorize(text);

    if (typeof window !== "undefined" && !window["$synthetic"]) {
      return styledConsoleLog(ansi_to_html(text));
    }

    log(text);
  }, downstreamDispatch);
};