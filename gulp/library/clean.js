import gulp from 'gulp';
import del from 'del';

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');
  // let outputDistEnv = libraryConfig.getOutputDistEnv();
  // let outputDistPath = outputDistEnv.joinPathByKeys(['js']);
  // gulp.task(libraryConfig.addPrefix('clean'), del.bind(null, [outputDistPath]));
  gulp.task(libraryConfig.addPrefix('clean'), function(cb) {
    return;
  });
}

const gulpModules = {addTasks};
export default gulpModules;
