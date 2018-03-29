import gulp from 'gulp';

function addWatchTasks(libraryConfig, envConfig){
  let jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
  let mainFunc = function(cb) {
    gulp.watch(jsSourceFiles, gulp.series(libraryConfig.addPrefix('build' + envConfig.postfix)));
    cb();
  };
  mainFunc.displayName = libraryConfig.addPrefix('watch:<main>' + envConfig.postfix);

  gulp.task(libraryConfig.addPrefix('watch' + envConfig.postfix), gulp.series(
    libraryConfig.addPrefix('build' + envConfig.postfix),
    mainFunc
  ));
}

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;