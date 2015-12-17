var gulp       = require('gulp'),
    swag       = require('gulp-swag'),
    lambda     = swag.lambda,
    apigateway = swag.apigateway,
    i          = swag.utils.interpolate;

gulp.task('lambda:server', function() {
  gulp.src('./handlers/*')
    .pipe(lambda.server({
      config : i('./env/{NODE_ENV}/config'),
      routes : i('./env/{NODE_ENV}/routes'),
      port   : 5000
    }));
});

gulp.task('lambda:deploy', function(){
  gulp.src('./handlers/*')
    .pipe(lambda.deploy({
      config : i('./env/{NODE_ENV}/config'),
      routes : i('./env/{NODE_ENV}/routes')
  }));
});

gulp.task('apigateway:deploy', function(){
  gulp.src(i('./env/{NODE_ENV}/routes.json'))
    .pipe(apigateway.deploy({
      handlers: './handlers',
      version : i('./env/{NODE_ENV}/version'),
      config  : i('./env/{NODE_ENV}/config'),
    }));
});
