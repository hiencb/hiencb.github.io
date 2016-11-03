const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

const taskBuildDataView = 'build-dataView';
const taskBuild = 'build';
const taskWatchDataView = 'watch-dataView';
const taskWatch = 'watch';
const taskBuildnWatch = 'build-n-watch';
const taskClean = 'clean';

const dest = 'dist';
const srcDataView = ['src/dataView/*.module.js', 'src/dataView/*.js'];

gulp.task(taskBuildDataView, () => {
  gulp.src(srcDataView)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('dataView.js'))
    .pipe(gulp.dest(dest))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
});

gulp.task(taskBuild, [taskBuildDataView]);

gulp.task(taskWatchDataView, () => {
  gulp.watch(srcDataView, [taskBuildDataView]);
});

gulp.task(taskWatch, [taskWatchDataView]);

gulp.task(taskBuildnWatch, [taskBuild, taskWatch]);

gulp.task(taskClean, () => del([dest]));

gulp.task('default', [taskBuildnWatch]);