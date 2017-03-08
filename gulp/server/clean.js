import gulp from 'gulp';
import del from 'del';

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  // let outputDistEnv = serverConfig.getOutputDistEnv();
  // let outputDevEnv = serverConfig.getOutputDistEnv();
  // let outputDistPath = outputDistEnv.joinPathByKeys(['js']);
  // let outputDevPath = outputDevEnv.joinPathByKeys(['js']);
  // gulp.task(serverConfig.addPrefix('clean'), del.bind(null, [outputDistPath, outputDevPath]));
  gulp.task(serverConfig.addPrefix('clean'), function(cb) {
    return;
  });
}

const gulpModules = {addTasks};
export default gulpModules;
