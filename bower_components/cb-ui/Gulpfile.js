const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

const taskBuildDataView = 'build-dataView';
const taskBuildDebugView = 'build-debugView';
const taskBuild = 'build';
const taskWatchDataView = 'watch-dataView';
const taskWatchDebugView = 'watch-debugView';
const taskWatch = 'watch';
const taskBuildnWatch = 'build-n-watch';
const taskClean = 'clean';

const dest = 'dist';
const srcDataView = ['src/dataView/*.module.js', 'src/dataView/*.js'];
const srcDebugView = ['src/debugView/*.module.js', 'src/debugView/*.js'];

gulp.task(taskBuildDataView, createModuleBuilder(srcDataView, dest, 'dataView.js'));

gulp.task(taskBuildDebugView, createModuleBuilder(srcDebugView, dest, 'debugView.js'));

gulp.task(taskBuild, [taskBuildDataView, taskBuildDebugView]);

gulp.task(taskWatchDataView, () => gulp.watch(srcDataView, [taskBuildDataView]));

gulp.task(taskWatchDebugView, () => gulp.watch(srcDebugView, [taskBuildDebugView]));

gulp.task(taskWatch, [taskWatchDataView, taskWatchDebugView]);

gulp.task(taskBuildnWatch, [taskBuild, taskWatch]);

gulp.task(taskClean, () => del([dest]));

gulp.task('default', [taskBuildnWatch]);

function createModuleBuilder(src, dest, name) {
  return () => gulp.src(src)
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat(name))
    .pipe(gulp.dest(dest))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest));
}

// TODO: create array tasks