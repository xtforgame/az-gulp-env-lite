import path from 'path';
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import yargs from 'yargs';

function addServeTasks(serverConfig, commonLibraryConfig, envConfig, serverOptions = {}){
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
    let nodemonConfig = {
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
      ...serverOptions.nodemon,
    };
    if(yargs.argv.inspect){
      nodemonConfig.exec = 'node --inspect';
    }
    let called = false;
    return nodemon(nodemonConfig)
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
    serverConfig.addPrefix('clean' + envConfig.postfix),
    gulp.parallel(...reloadTasks),
    mainFunc
  ));
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();
  let serverOptionsList = serverConfig.getOptionsForDevDist() || [];

  envConfigs.map((envConfig, i) => addServeTasks(serverConfig, commonLibraryConfig, envConfig, serverOptionsList[i] || {}));
}

const gulpModules = {addTasks};
export default gulpModules;
