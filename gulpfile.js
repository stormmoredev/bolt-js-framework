const { src, dest, watch, series } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const tap = require('gulp-tap');
const path = require('path');
const fs = require('fs');


function framework(cb) {
  src('src/**/*.js')
    .pipe(concat('storm.js'))
    .pipe(terser())
    .pipe(dest('dist'))
    .pipe(dest('docs'))
  cb();
}

function watcher(cb) {
  watch('src/**/*.js', framework);
  cb();
}

exports.default = series(framework, watcher);