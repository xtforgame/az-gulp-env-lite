import gulp from 'gulp';
import del from 'del';
import { GulpConfig, EnvConfig } from '../gulp-config';

function addCleanTasks(serverConfig : GulpConfig, envConfig : EnvConfig){
  let outputDistEnv = serverConfig.getOutputDistEnv();
  let outputDir = envConfig.env.joinPathByKeys([]);

  gulp.task(serverConfig.addPrefix('clean' + envConfig.postfix), function(cb : () => void) {
    return del([outputDir]);
  });
}

function addTasks(gulpConfig : GulpConfig){
  let serverConfig = <GulpConfig>gulpConfig.getSubmodule('server');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map((envConfig, i) => addCleanTasks(serverConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
