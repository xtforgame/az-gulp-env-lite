import gulp from 'gulp';
import del from 'del';

function addCleanTasks(serverConfig, envConfig){
  let outputDistEnv = serverConfig.getOutputDistEnv();
  let outputDir = envConfig.env.joinPathByKeys([]);

  gulp.task(serverConfig.addPrefix('clean' + envConfig.postfix), function(cb) {
    return del([outputDir]);
  });
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map((envConfig, i) => addCleanTasks(serverConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
