'use strict';

//Dependencies
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');
var config = require('./config.json');
var tsConfig = require('../tsconfig.json');


/**
 * Create typescript project build reference for incremental compilation under watch tasks
 *
 * @link https://github.com/ivogabe/gulp-typescript
 */
const tsProject = ts.createProject('tsconfig.json', {
  // Override package version of typescript to use latest compiler version
  typescript: require('typescript')
});

/**
 * Cleans the dist folder
 */
gulp.task('clean', false, () => del(['dist']));

/**
 * Precopies all non-ts files into the dist folder
 */
gulp.task('copyNonTs', false, () =>
  gulp.src(['src/.env', 'src/**/*', '!src/**/*.ts'])
    .pipe(gulp.dest('dist'))
);

/**
 * Lints typescript code
 */
gulp.task('lint', 'Runs a typescript linter on the application code', () =>
  gulp.src(config.tsLinter.sources)
    .pipe(tslint(config.tsLinter.options))
    .pipe(tslint.report())
);

/**
 * Compiles typescript app into js
 */
gulp.task('compile', false, () => {
  var tsResult = gulp.src(['typings/index.d.ts', 'src/**/*.ts', 'gulp/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsProject(ts.reporter.longReporter()));

  return tsResult.js
    .pipe(sourcemaps.write('.', { // This outputs the sourcesmaps alongside the sources in a .js.map file, not sure if that is the cause of non-functoning breakpoints
      sourceRoot: '../src'
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * Build the server app
 */
gulp.task('build', 'Builds the server app (compiles & copies)', (callback) =>
  runSequence('clean',
    ['compile'],
    'copyNonTs',
    callback)
);