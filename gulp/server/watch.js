import gulp from 'gulp';

function addWatchTasks(serverConfig, envConfig){
  let jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
  gulp.task(serverConfig.addPrefix('watch' + envConfig.postfix), serverConfig.addPrefix(['serve' + envConfig.postfix]), function(cb) {
    gulp.watch(jsSourceFiles, serverConfig.addPrefix(['build' + envConfig.postfix]));
    cb();
  });
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(serverConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;