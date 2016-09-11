var gulp = require('gulp')
var file = require('gulp-file')
var uglify = require('gulp-uglify')
var replace = require('gulp-replace')
var merge = require('merge2')
var htmlmin = require('gulp-htmlmin')
var zip = require('gulp-zip')
var fs = require('fs')
var size = require('gulp-size')
var notify = require('gulp-notify')
var stripDebug = require('gulp-strip-debug')
var livereload = require('gulp-livereload')
var concat = require('gulp-concat')
var insert = require('gulp-insert')
var clone = require('gulp-clone')
var babel = require('gulp-babel')

gulp.task('build', function () {
  var s = size()
  var client = merge(gulp.src(['src/client/globals.js','src/client/*.*','!src/client/init.js'])
          .pipe(createBabel()),
          gulp.src(['src/client/init.js'])
            .pipe(createBabel()))
    .pipe(concat('client.js'))
    .pipe(insert.wrap('if (typeof window !== \'undefined\') {(function (){', '})()}'))
  var shared = gulp.src(['src/shared/shared.js', 'src/shared/*.*'])
    .pipe(createBabel())
    .pipe(concat('shared.js'))
  var server = gulp.src('src/server/*.*')
    .pipe(createBabel())
    .pipe(concat('server.js'))
    .pipe(insert.wrap('if (typeof window === \'undefined\') {(function (){', '})()}'))

  var js = merge(shared, client, server)
    .pipe(concat('server.js'))
    .pipe(insert.wrap('(function () {"use strict"\n', '})()'))

  // Just for the sake of having a public.js files as the rules
  var clientFile = file('client.js', '', {src: true})
  var sharedFile = file('shared.js', '', {src: true})
  var html = gulp.src('./src/index.html')
    .pipe(replace('<script src="/shared.js"></script>', ''))
    .pipe(replace('/client.js', '/server.js'))
    .pipe(htmlmin({collapseWhitespace: true}))

  merge(js, html, clientFile, sharedFile)
    .pipe(gulp.dest('public'))
    .pipe(livereload())

  var minifiedJs = js/*.pipe(clone())*/.pipe(stripDebug().on('error', function (e) {console.error(e)})).pipe(babel({presets:['babili']}))
  // So we can quickly check minification is right
  minifiedJs.pipe(gulp.dest('dist'))
  merge(minifiedJs, html, clientFile, sharedFile)
    .pipe(zip('archive.zip'))
    .pipe(s)
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      onLast: true,
      message: ()=> `Total size is ${s.prettySize}. Which is ${(s.size /13312 * 100).toFixed(2)} %`
    }))

})


gulp.task('watch', function () {
  livereload({start: true})
  gulp.watch(['./src/**/*.*'], ['build'])
})
gulp.task('default', [ 'watch'])

function createBabel() {
  return babel({plugins:['meaningful-logs']}).on('error', function (e) {console.error(e)})
}