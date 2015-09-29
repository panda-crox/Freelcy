var gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    insert = require('gulp-insert'),
    server = require('gulp-express');


gulp.task('sass', function () {
    gulp.src(['./**/*.scss', '!./**/_*.scss'], {cwd: 'client'})
        .pipe(insert.prepend('@import "_variables", "_mixins";'))
        .pipe(sass({
            includePaths: 'client/_source/sass/'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(csso())
        .pipe(gulp.dest('./build'));
});


gulp.task('default', ['sass'], function () {
    server.run(['app.js']);
    gulp.watch(['./**/*.scss'], ['sass']);
    gulp.watch(['./**/*.twig'], server.run);
    gulp.watch(['app.js', 'routes/**/*.js'], server.run);
});