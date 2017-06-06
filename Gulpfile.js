'use strict';

const gulp    = require('gulp');
const merge   = require('merge2');
const glob    = require('glob');
const {spawn} = require('child_process');
const {join}  = require('path');
const {argv}  = require('yargs');
const gutil   = require('gulp-util');

gulp.task('default', ['build']);

const PACKAGE_DIRS         = [
  ...glob.sync('./packages/*'),
  ...glob.sync('./examples/*')
];

const NODE_MODULES_DIR     = join(__dirname, 'node_modules');
const NODE_MODULES_BIN_DIR = join(NODE_MODULES_DIR, '.bin');
const WATCH                = argv.watch != null;
const GREP                 = argv.grep;

console.log(PACKAGE_DIRS);

const gulpSpawn = (command, args, options) => {
  const proc = spawn(command, args, options);

  proc.stdout.setEncoding('utf8');
  proc.stderr.setEncoding('utf8');

  proc.stdout.on('data', data => {
    gutil.log(data.trim());
  });

  proc.stderr.on('data', data => {
    gutil.log(gutil.colors.red(data.trim()));
    gutil.beep();
  });

  return proc.stdout;
};

// extraArgs(WATCH, watchArgs, GREP, grepArgs)
const extraArgs = function() {
  let extra = [];
  for (let i = 0; i < arguments.length; i += 2) {
    const flag  = arguments[i];
    const arg   = arguments[i + 1];
    if (flag) extra.push(...[].concat((typeof arg === 'function' ? arg() : arg)));
  }

  return extra.length ? ['--', ...extra] : [];
};

gulp.task('build', () => {
  return merge(PACKAGE_DIRS.map((dir) => (
    gulpSpawn(join(NODE_MODULES_BIN_DIR, 'tsc'), ['--declaration', '--pretty', ...(WATCH ? ['--watch'] : [])], { cwd: dir })
  )));
});

gulp.task('test', () => {
  return merge(PACKAGE_DIRS.map((dir) => (
    gulpSpawn('npm', ['test', ...extraArgs(WATCH, '--watch', GREP, ['--grep', GREP])], { cwd: dir })
  )));
});

gulp.task('npm:link', () => {
  return merge(PACKAGE_DIRS.map((dir) => (
    gulpSpawn('npm', ['link'], { cwd: dir })
  )));
});

gulp.task('npm:patch', () => {
  // TODO 
});

gulp.task('npm:publish', () => {
  return merge(PACKAGE_DIRS.map((dir) => (
    gulpSpawn('npm', ['publish'], { cwd: dir })
  )));
});