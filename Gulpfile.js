'use strict';

const gulp      = require('gulp');
const glob      = require('glob');
const gutil     = require('gulp-util');
const merge     = require('merge2');
const {join}    = require('path');
const {argv}    = require('yargs');
const {spawn}   = require('child_process');
const gsequence = require('gulp-sequence');
const {keys, intersection} = require('lodash');

gulp.task('default', ['build']);

const PACKAGE_DIRS         = [
  ...glob.sync('./packages/*'),
  ...glob.sync('./examples/*')
];

const PACKAGE_NAMES = PACKAGE_DIRS.map(dir => dir.split('/').pop());

const NODE_MODULES_DIR     = join(__dirname, 'node_modules');
const NODE_MODULES_BIN_DIR = join(NODE_MODULES_DIR, '.bin');
const WATCH                = argv.watch != null;
const GREP                 = argv.grep;

const gulpSpawn = (command, args, options) => {
  gutil.log([command, ...args, options.cwd].join(' '));
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

const createPackageSpawnTask = (command, ...args) => () => merge(PACKAGE_DIRS.map((dir) => (
  gulpSpawn(command, args, { cwd: dir })
)))

gulp.task('install', createPackageSpawnTask('yarn', 'install'));
gulp.task('build', createPackageSpawnTask('npm', 'run', 'build', ...(WATCH ? ['--', '--watch'] : [])));
gulp.task('test', createPackageSpawnTask('npm', 'test', ...extraArgs(WATCH, '--watch', GREP, ['--grep', GREP])));
gulp.task('link', gsequence('yarn:link:criss', 'yarn:link:cross'));

/**
 * Link packages globally
 */

gulp.task('yarn:link:criss', createPackageSpawnTask('yarn', 'link'));

/**
 * Link package dependencies
 */

gulp.task('yarn:link:cross', () => {
  return merge(
    PACKAGE_DIRS.map(dir => {
      const pkg = require(join(__dirname, dir, 'package.json'));
      return merge(intersection(keys(Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {})), PACKAGE_NAMES).map((dep) => {
        return gulpSpawn('yarn', ['link', dep], { cwd: dir });
      }));
    })
  );
  return createPackageSpawnTask('yarn', 'link')();
});

gulp.task('npm:patch', () => {
  // TODO 
});

gulp.task('npm:publish', createPackageSpawnTask('npm', 'publish'));
gulp.task('clean', ['clean:node_modules', 'clean:yarnlock']);

gulp.task('clean:node_modules', createPackageSpawnTask('rm', '-rf', 'node_modules'));
gulp.task('clean:yarnlock', createPackageSpawnTask('rm', 'yarnlock'));
