var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var browserify = require('browserify');
var babelify = require('babelify');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

gulp.task('default', ['build_dev', 'watch']);

gulp.task('build_dev', ['build_dev_script', 'build_dev_css']);
gulp.task('build_prod', ['build_prod_script', 'build_prod_css']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./client/src/js/**/*.js', ['build_dev_script']);
    gulp.watch('./client/src/sass/**/*.scss', ['build_dev_css']);
});


gulp.task('build_dev_script', function () {
    var bundledStream = through();

    bundledStream
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./client/dist/js/'))
        .pipe(livereload());

    globby(['./client/src/js/*.js'], function(err, entries) {
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        var b = browserify({
            entries: entries,
            transform: [babelify]
        });

        b.bundle().pipe(bundledStream);
    });

    return bundledStream;
});


gulp.task('build_dev_css', function () {
    return gulp.src('./client/src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/dist/css'))
        .pipe(livereload());
}); 

gulp.task('build_prod_script', function () {
    var bundledStream = through();

    bundledStream
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest('./client/dist/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./client/dist/js/'));

    globby(['./client/src/js/*.js'], function(err, entries) {
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        var b = browserify({
            entries: entries,
            debug: true,
            transform: [babelify]
        });

        b.bundle().pipe(bundledStream);
    });

    return bundledStream;
});


gulp.task('build_prod_css', function () {
    return gulp.src('./client/src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulp.dest('./client/dist/css'))
        .pipe(minifyCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./client/dist/css'));
}); 


