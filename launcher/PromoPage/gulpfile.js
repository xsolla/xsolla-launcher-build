const webpack = require('webpack');
const config = require('./webpack.config');
const gulp = require('gulp');

const buildFolder = './build/*.*';
const resultZipName = 'build.7z';

gulp.task('archive-linux', callback => {
  const p7zip = require('p7zip');

  webpack(config, () => {
    p7zip.add(resultZipName, buildFolder);
    callback();
  });
});

gulp.task('archive-win' , callback => {
  const Zip = require('node-7z');
  const zipTask = new Zip();

  webpack(config, () => {
      zipTask.add(resultZipName, buildFolder);
      callback();
    }
  );
});
