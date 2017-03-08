import gulp from 'gulp';

function addWatchTasks(libraryConfig, envConfig){
  let jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
  gulp.task(libraryConfig.addPrefix('watch' + envConfig.postfix), libraryConfig.addPrefix(['build' + envConfig.postfix]), function(cb) {
    gulp.watch(jsSourceFiles, libraryConfig.addPrefix(['build' + envConfig.postfix]));
    cb();
  });
}

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;