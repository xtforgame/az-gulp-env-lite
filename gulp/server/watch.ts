import gulp from 'gulp';
import { GulpConfig, EnvConfig } from '../gulp-config';

function addWatchTasks(serverConfig : GulpConfig, envConfig : EnvConfig){
  let jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
  let mainFunc = function(cb : () => void) {
    // let `serve`(nodemon) handle this
    cb();
  };
  (<any>mainFunc).displayName = serverConfig.addPrefix('watch:<main>' + envConfig.postfix);

  gulp.task(serverConfig.addPrefix('watch' + envConfig.postfix), gulp.series(
    gulp.parallel(...<Array<string>>serverConfig.addPrefix(['serve' + envConfig.postfix])),
    mainFunc
  ));
}

function addTasks(gulpConfig : GulpConfig){
  let serverConfig = <GulpConfig>gulpConfig.getSubmodule('server');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(serverConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;