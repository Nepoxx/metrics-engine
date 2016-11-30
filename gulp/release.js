'use strict';

//Dependencies
const gulp = require('gulp');
const bump = require('gulp-bump');
const git = require('gulp-git');
const del = require('del');
const fs = require('fs');

/**
 * Reads the package.json file
 * `fs` is used instead of require to prevent caching in watch (require caches)
 * @returns {json}
 */
function getPackageJson() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
}

gulp.task('bump', false, ['lint', 'test'], () =>
  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({ type: VERSION_TYPE }))
    .pipe(gulp.dest('./'))
);

gulp.task('commit', false, ['bump'], () => {

  let pkg = getPackageJson();
  let v = `v${pkg.version}`;
  let message = `Release ${v}`;

  return gulp.src('./')
    .pipe(git.add())
    .pipe(git.commit(message));
});

gulp.task('release', 'Bumps package version, tags release & pushes the current branch to the origin repo', ['commit'], () => {

  let pkg = getPackageJson();
  let v = `v${pkg.version}`;
  let message = `Release ${v}`;

  git.tag(v, message, function (err) {
    if (err) throw err;
  });

  git.push('origin', 'HEAD', { args: ' --tags' }, function (err) {
    if (err) throw err;
  });

}, {
    options: {
      'version [minor]': 'The semantic version type for this release [patch|minor|major]. See http://semver.org/ for information.'
    }
  });

