import gulp from 'gulp';

function addWatchTasks(serverConfig, envConfig){
  let jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
  let mainFunc = function(cb) {
    /* let `serve`(nodemon) handle this
      gulp.watch(jsSourceFiles, serverConfig.addPrefix(['build' + envConfig.postfix]));
    */
    cb();
  };
  mainFunc.displayName = serverConfig.addPrefix('watch:<main>' + envConfig.postfix);

  gulp.task(serverConfig.addPrefix('watch' + envConfig.postfix), gulp.series(
    gulp.parallel(...serverConfig.addPrefix(['serve' + envConfig.postfix])),
    mainFunc
  ));
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(serverConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;