import gulp from 'gulp';
import del from 'del';

function addTasks(gulpConfig){
  let testConfig = gulpConfig.getSubmodule('test');
  // let outputDistEnv = testConfig.getOutputDistEnv();
  // let outputDistPath = outputDistEnv.joinPathByKeys(['js']);
  // gulp.task(testConfig.addPrefix('clean'), del.bind(null, [outputDistPath]));
  gulp.task(testConfig.addPrefix('clean'), function(cb) {
    return;
  });
}

const gulpModules = {addTasks};
export default gulpModules;
