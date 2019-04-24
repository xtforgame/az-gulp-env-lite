import gulp from 'gulp';
import { GulpConfig, EnvConfig } from '../gulp-config';

function addWatchTasks(libraryConfig : GulpConfig, envConfig : EnvConfig){
  let jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
  let mainFunc = function(cb : () => void) {
    gulp.watch(jsSourceFiles, gulp.series(libraryConfig.addPrefix('build' + envConfig.postfix)));
    cb();
  };
  (<any>mainFunc).displayName = libraryConfig.addPrefix('watch:<main>' + envConfig.postfix);

  gulp.task(libraryConfig.addPrefix('watch' + envConfig.postfix), gulp.series(
    libraryConfig.addPrefix('build' + envConfig.postfix),
    mainFunc
  ));
}

function addTasks(gulpConfig : GulpConfig){
  let libraryConfig = <GulpConfig>gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;