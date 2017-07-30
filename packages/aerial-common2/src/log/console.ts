import chalk =  require("chalk");
import { take, select } from "redux-saga/effects";
import path = require("path");
import moment = require("moment");
import { titleize } from "inflection";
import { parallel } from "mesh";
import { weakMemo } from "../memo";
import AnsiUp from "ansi_up";
import { reader } from "../monad";
import { noop } from "lodash";
import { ImmutableObject, createImmutableObject } from "../immutable";
import { LogLevel, LogAction, LogActionTypes, Logger } from "./base";

// beat TS type checking
chalk.enabled = true;

function createLogColorizer(tester: RegExp, replaceValue: any) {
  return function(input: string) {
    if (!tester.test(input)) return input;
    return input.replace(tester, replaceValue);
  }
}

export type ConsoleLogState = {
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
const defaultState = { level: LogLevel.ALL, prefix: "" };

export function* consoleLogSaga() {

  while(true) {
    const { log: { level: acceptedLevel, prefix }}: ConsoleLogState = (yield select()) || defaultState;
    let { text, level }: LogAction = (yield take(LogActionTypes.LOG));
    if (!(acceptedLevel & level)) continue;
    const log = {
      [LogLevel.DEBUG]: console.log.bind(console),
      [LogLevel.LOG]: console.log.bind(console),
      [LogLevel.INFO]: console.info.bind(console),
      [LogLevel.WARNING]: console.warn.bind(console),
      [LogLevel.ERROR]: console.error.bind(console)
    }[level];


    text = PREFIXES[level] + (prefix || "") + text;
    text = colorize(text);

    if (typeof window !== "undefined" && !window["$synthetic"]) {
      return styledConsoleLog(new AnsiUp().ansi_to_html(text));
    }

    log(text);
  }
}
