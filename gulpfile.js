'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// 打包js
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');



gulp.task('default', ['sass','js'], function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/modules/**/*.js', ['js']);
});



gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('scripts', function() {
    var files = [

    ];

    return gulp.src(files)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./source/js'));
});

gulp.task('js', function() {
    rollup.rollup({
        entry: 'src/modules/main.js',
        plugins: [babel()]
    }).then(function(bundle) {
        bundle.write({
            format: 'iife',
            moduleName: 'main', //umd或iife模式下，若入口文件含 export，必须加上该属性
            dest: 'src/build/bundle.js'
        });
    });
})
