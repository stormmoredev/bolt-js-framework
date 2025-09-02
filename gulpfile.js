const { src, dest, watch, series } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const tap = require('gulp-tap');
const path = require('path');
const fs = require('fs');

function htmlToJs() {
  const templates = {};
  return src('templates/**/*.html')
    .pipe(tap(function(file) {
      const fileName = path.basename(file.path);
      const content = file.contents.toString().replace(/`/g, '\\`');
      templates[fileName] = content.replace(/\r?\n|\r/g, '');
    }))
    .on('end', function () {
      const output = `const templates = ${JSON.stringify(templates, null, 2)};`;
      fs.writeFileSync('dst/templates.js', output);
    });
}

function framework(cb) {
  src('src/**/*.js')
    .pipe(concat('storm.js'))
    .pipe(terser())
    .pipe(dest('dst'))
    .pipe(dest('docs'));
  cb();
}

function watcher(cb) {
  watch('src/**/*.js', framework);
  cb();
}

exports.default = series(framework, watcher);