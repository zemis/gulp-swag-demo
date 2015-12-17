var gulp  = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('mocha:lambdas', function() {
    return gulp.src(['test/lambdas/**/*.spec.js'], { read: false })
        .pipe(mocha({
          reporter: 'dot',
          globals: {
            chai:      require('chai'),
            sinon:     require('sinon'),
            sinonChai: require('sinon-chai')
          }
        }))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['handlers/**/*.js', 'test/lambdas/**/*.spec.js'], ['mocha:lambdas']);
});

gulp.task('mocha:routes', function() {
    return gulp.src(['test/routes/**/*.spec.js'], { read: false })
        .pipe(mocha({
          reporter: 'dot',
          globals: {
            chai:      require('chai'),
            sinon:     require('sinon'),
            sinonChai: require('sinon-chai')
          }
        }))
        .on('error', gutil.log);
});


gulp.task('mocha', ['mocha:lambdas', 'mocha:routes']);
