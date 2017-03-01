var gulp = require('gulp'),
	watch = require('gulp-watch'),
	rename = require('gulp-rename'),

	less = require('gulp-less'),
	csscomb = require('gulp-csscomb'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCss = require('gulp-csso'),

	uglify = require('gulp-uglify');

gulp.task('styles', function(){
  return gulp.src('demo/Styles/main.less')
    .pipe(less())
    .pipe(csscomb())
    .pipe(autoprefixer({
    	browsers: ['last 4 versions'],
            cascade: false
    }))
    .pipe(gulp.dest('demo/Styles'))
    .pipe(rename({
		suffix: '.min'
	}))
    .pipe(minifyCss())
    .pipe(gulp.dest('demo/Styles'))
});

gulp.task('scripts', function() {
  return gulp.src('demo/Scripts/gulpy.js')
    .pipe(rename({
    	suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('demo/Scripts'))
});

gulp.task('watch', ['styles', 'scripts'], function(){
  gulp.watch('demo/Styles/**/*.less', ['styles']); 
  gulp.watch('demo/Scripts/*.js', ['scripts']);
});

gulp.task('default', function () {
  gulp.start('watch');
});