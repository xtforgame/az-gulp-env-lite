import gulp from 'gulp';
import del from 'del';
import { GulpConfig, EnvConfig } from '../gulp-config';

function addCleanTasks(libraryConfig : GulpConfig, envConfig : EnvConfig){
  let outputDistEnv = libraryConfig.getOutputDistEnv();
  let outputDir = envConfig.env.joinPathByKeys([]);

  gulp.task(libraryConfig.addPrefix('clean' + envConfig.postfix), function(cb : () => void) {
    return del([outputDir]);
  });
}

function addTasks(gulpConfig : GulpConfig){
  let libraryConfig = <GulpConfig>gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map((envConfig, i) => addCleanTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
