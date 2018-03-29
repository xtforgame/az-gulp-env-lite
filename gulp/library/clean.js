import gulp from 'gulp';
import del from 'del';

function addCleanTasks(libraryConfig, envConfig){
  let outputDistEnv = libraryConfig.getOutputDistEnv();
  let outputDir = envConfig.env.joinPathByKeys([]);

  gulp.task(libraryConfig.addPrefix('clean' + envConfig.postfix), function(cb) {
    return del([outputDir]);
  });
}

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map((envConfig, i) => addCleanTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
