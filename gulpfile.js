var gulp       = require('gulp')
  , clean      = require('gulp-clean')
  , uglify     = require('gulp-uglify')
  , rename     = require('gulp-rename')
  , sourcemaps = require('gulp-sourcemaps')
  , browserify = require('browserify')
  , fs         = require('fs')

gulp.task('clean', function() {
  return gulp.src('dist/*.*', { read: false })
    .pipe(clean())
})

gulp.task('compile', function() {
  return browserify('src/randomart', { debug: true, standalone: 'randomart' })
    .bundle()
    .pipe(fs.createWriteStream('dist/randomart.js'))
})

gulp.task('minify', ['compile'], function() {
  return gulp.src(['dist/*.js', '!dist/*.min.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})
