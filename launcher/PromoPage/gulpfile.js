const webpack = require('webpack');
const config = require('./webpack.config');
const gulp = require('gulp');

const Zip = require('node-7z');
const zipTask = new Zip();
const p7zip = require('p7zip');

const buildFolder = './build/*.*';
const resultZipName = 'build.7z';

gulp.task('archive-linux', callback => {
  webpack(config, () => {
    p7zip.add(resultZipName, buildFolder);
    callback();
  });
});

gulp.task('archive-win' , callback => {
  webpack(config, () => {
      zipTask.add(resultZipName, buildFolder);
      callback();
    }
  );
});
