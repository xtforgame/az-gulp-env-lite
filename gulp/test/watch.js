import gulp from 'gulp';
import yargs from 'yargs';

function addWatchTasks(testConfig, envConfig){
  let jsSourceFiles = testConfig.joinPathByKeys(['entry', 'js', 'glob']);
  let watchFiles = yargs.argv['watch-files'];

  gulp.task(testConfig.addPrefix('watch' + envConfig.postfix), testConfig.addPrefix(['test' + envConfig.postfix]), function(cb) {
    gulp.watch(jsSourceFiles, testConfig.addPrefix(['test' + envConfig.postfix]));
    if(watchFiles){
      gulp.watch(watchFiles, testConfig.addPrefix(['test' + envConfig.postfix]));
    }
    cb();
  });
}

function addTasks(gulpConfig){
  let testConfig = gulpConfig.getSubmodule('test');
  let envConfigs = testConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addWatchTasks(testConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;