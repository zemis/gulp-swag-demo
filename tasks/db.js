var gulp = require('gulp'),
    swag = require('gulp-swag'),
    db   = swag.dynamodb,
    i    = swag.utils.interpolate;

gulp.task('db:migrate', function(){
  return gulp.src('./db/definitions/*.json')
    .pipe(db.migrate({
      config: i('./env/{NODE_ENV}/config.json')
    }));
});
