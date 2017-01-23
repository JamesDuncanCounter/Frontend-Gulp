var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    cssnano = require('gulp-cssnano'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    ssi = require('gulp-connect-ssi'),
    copy = require('gulp-copy'),
    livereload = require('gulp-livereload'),
    cache = require('gulp-cache'),
    modernizr = require('gulp-modernizr'),
    customizr = require('customizr'),
    sassdoc = require('sassdoc'),
    converter = require('sass-convert'),
    del = require('del');


gulp.task('styles', function() {
    return sass('dev/stylesheets/style.scss', { style: 'expanded' })
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/tether/dist/js/tether.js', 'node_modules/bootstrap/dist/js/bootstrap.js', 'dev/app/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dev/javascript'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('copy', function() {
    return gulp.src('dev/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dev/_lib']);
});

gulp.task('modernizr', function() {
    gulp.src('**/*.js')
        .pipe(modernizr(
            {
                options: [
                    'setClasses'
                ],

                tests: [

                ],
            }
        ))
        .pipe(gulp.dest("dist/js"))
        .pipe(uglify())
});

gulp.task('sassdoc', function () {
    var options = {
        dest: 'dev/_lib/sassdoc/',
    };
    return gulp.src('dev/**/*.+(sass|scss)')
        .pipe(converter({
            from: 'sass',
            to: 'scss',
        }))
        .pipe(sassdoc(options))
});

gulp.task('server', function() {
    connect.server({
        livereload: true,
        root:['./'],
        port: 3001,
        middleware: function(){
            return [ssi({
                baseDir: __dirname + '/',
                ext: '.shtml',
                domain: 'localhost:3001',
                method: 'readOnLineIfNotExist'  // readOnLine|readLocal|readOnLineIfNotExist|downloadIfNotExist
            })];
        }
    });
});

gulp.task('default', ['clean'], function() {
    gulp.start('server', 'copy', 'styles', 'scripts', 'modernizr', 'sassdoc', 'watch');
});

gulp.task('watch', function(){
    gulp.watch('dev/**/*.scss', ['styles']);

    gulp.watch('dev/app/**/*.js', ['scripts']);

    gulp.watch('dev/fonts/**/*', ['copy']);

    livereload.listen();

    gulp.watch(['dist/**', 'dev/**']).on('change', livereload.changed);
});