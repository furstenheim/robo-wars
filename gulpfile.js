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

gulp.task('build', function () {
  var s = size()
  var client = gulp.src(['src/client/init.js', 'src/client/*.*'])
    .pipe(concat('client.js'))
    .pipe(insert.wrap('if (typeof window !== \'undefined\') {(function (){', '})()}'))
  var shared = gulp.src('src/shared/*.*')
    .pipe(concat('shared.js'))
  var server = gulp.src('src/server/*.*')
    .pipe(concat('server.js'))
    .pipe(insert.wrap('if (typeof window === \'undefined\') {(function (){', '})()}'))

  var js = merge(shared, client, server)
    .pipe(concat('server.js'))
    .pipe(insert.wrap('(function () {', '})()'))

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

  var minifiedJs = js.pipe(stripDebug().on('error', function (e) {console.error(e)})).pipe(uglify()
  )

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