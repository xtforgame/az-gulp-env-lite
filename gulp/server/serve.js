import path from 'path';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';

function addServeTasks(serverConfig, commonLibraryConfig, envConfig){
  let serverSourceDir = serverConfig.joinPathByKeys(['entry']);
  let delay = serverConfig.get('reloadDelay') || 1000;
  let watchArray = [serverSourceDir]
  let useCommonLibrary = serverConfig.get('useCommonLibrary');
  if(commonLibraryConfig && useCommonLibrary){
    let commonLibrarySourceDir = commonLibraryConfig.joinPathByKeys(['entry']);
    watchArray.push(commonLibrarySourceDir);
  }

  let outputEntryFile = envConfig.env.joinPathByKeys(['js', 'filename']);
  let reloadTasks = serverConfig.addPrefix(['build' + envConfig.postfix, 'build:extras' + envConfig.postfix]);

  let mainFunc = function (cb) {
    let called = false;
    return nodemon({
      script: outputEntryFile,
      watch: watchArray,
      ignore: [
        serverSourceDir + '/app-doc/',
        'gulpfile.babel.js',
        'node_modules/',
        'doc/',
      ],
      tasks: reloadTasks,
      delay,
    })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        // do some callback
      }, 1000);
    });
  };
  mainFunc.displayName = serverConfig.addPrefix('serve:<main>' + envConfig.postfix);

  gulp.task(serverConfig.addPrefix('serve' + envConfig.postfix), gulp.series(
    gulp.parallel(...reloadTasks),
    mainFunc
  ));
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addServeTasks(serverConfig, commonLibraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
