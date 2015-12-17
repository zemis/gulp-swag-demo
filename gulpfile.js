var gulp       = require('gulp'),
    requireDir = require('require-dir'),
    tasks      = requireDir('./tasks');

require('gulp-task-list')(gulp);

gulp.task('default', ['mocha']);
