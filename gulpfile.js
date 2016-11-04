var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    babel       = require("gulp-babel");

var config = {
    src:            './src',
    dist:           './dist',
    todomvcApp:     './node_modules/todomvc-app-css/index.css',
    todomvcCommon:  './node_modules/todomvc-common/base.css'
};

gulp.task('serve', ['nodeToDistCss', 'srcToDistAll', 'concatMin'], function() {
    browserSync.init({
      server: config.dist
    });

    gulp.watch(config.src + '/**/*', ['srcToDistAll', 'concatMin']);
});

gulp.task('nodeToDistCss', function() {
    return gulp.src([
      config.todomvcApp,
      config.todomvcCommon
    ])
    .pipe(gulp.dest(config.dist + '/vendor/css'))
    .pipe(browserSync.stream());
});

gulp.task('srcToDistAll', function() {
    return gulp.src([
      config.src + '/*'
    ])
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.stream());
});

gulp.task('concatMin', function() {
    return gulp.src([
      config.src + '/js/*.js'
    ])
    .pipe(babel({
            presets: ['es2015']
        }))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.dist + '/js'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);