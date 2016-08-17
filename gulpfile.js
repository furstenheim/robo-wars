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

gulp.task('build', function () {
  var s = size()
  var client = fs.readFileSync('./src/client.js').toString()
  var shared = fs.readFileSync('./src/shared.js').toString()
  var server = fs.readFileSync('./src/server.js').toString()
  // Everything in functions so minify can work better
  var final = `
  (function () {
  ${shared}
  if (typeof window !== 'undefined') {
  ${client}
  } else {
  (function() {
  ${server}
  })()}
  })()
  `
  var js = file('server.js', final, {src: true})
    .pipe(uglify())
  // Just for the sake of having a public.js files as the rules
  var clientFile = file('client.js', '', {src: true})
  var sharedFile = file('shared.js', '', {src: true})
  var html = gulp.src('./src/index.html')
    .pipe(replace('<script src="/shared.js"></script>', ''))
    .pipe(replace('/client.js', '/server.js'))
    .pipe(htmlmin({collapseWhitespace: true}))

  merge(js, html, clientFile, sharedFile)
    .pipe(gulp.dest('public'))

  merge(js.pipe(stripDebug()), html, clientFile, sharedFile)
    .pipe(zip('archive.zip'))
    .pipe(s)
    .pipe(gulp.dest('dist'))
    .pipe(notify({
      onLast: true,
      message: ()=> `Total size is ${s.prettySize}. Which is ${(s.size /13312 * 100).toFixed(2)} %`
    }))
})

gulp.task('watch', function () {
  gulp.watch(['./src/*.*'], ['build'])
})
gulp.task('default', ['watch'])