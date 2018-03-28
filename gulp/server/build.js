import gulp from 'gulp';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

function addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig){
  // compile server side scripts
  gulp.task(serverConfig.addPrefix('build:common' + envConfig.postfix), () => {
    let jsSourceFiles = commonLibraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    let relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);
    
    return gulp.src(jsSourceFiles)
      //.pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel({
        //modules: 'amd',
        moduleIds: false,
        comments: false,
        compact: false,
        'plugins': ['transform-decorators-legacy', 'transform-class-properties'],
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(jsOutputDir, relativePath)));
  });
}

function addBuildTasks(serverConfig, commonLibraryConfig, envConfig){
  let waitingTasks = [/*'clean'*/];
  let useCommonLibrary = serverConfig.get('useCommonLibrary');

  if(useCommonLibrary && commonLibraryConfig){
    addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig);
    waitingTasks.push('build:common' + envConfig.postfix);
  }

  waitingTasks = serverConfig.addPrefix(waitingTasks);

  let mainFunc = function () {
    let jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    return gulp.src(jsSourceFiles)
      //.pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel({
        //modules: 'amd',
        moduleIds: false,
        comments: false,
        compact: false,
        /*
        'presets': ['es2015', 'react', 'stage-2'],
        'plugins': ['transform-decorators-legacy', 'transform-class-properties'],
        */
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(jsOutputDir));
  };
  mainFunc.displayName = serverConfig.addPrefix('build:<main>' + envConfig.postfix);

  gulp.task(serverConfig.addPrefix('build' + envConfig.postfix), gulp.series(
    gulp.parallel(...waitingTasks),
    mainFunc
  ));

  // prepare everything except js from server side for dev mode
  gulp.task(serverConfig.addPrefix('build:extras' + envConfig.postfix), /*['server:clean'],*/ () => {
    let serverSourceDir = serverConfig.joinPathByKeys(['entry']);
    let jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let outputDir = envConfig.env.joinPathByKeys([]);
    return gulp.src([
      `${serverSourceDir}/**/*.*`,
      `!${jsSourceFiles}`,
    ], {
      dot: true,
    }).pipe(gulp.dest(outputDir));
  });
}

function addTasks(gulpConfig){
  let serverConfig = gulpConfig.getSubmodule('server');
  let commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(envConfig => addBuildTasks(serverConfig, commonLibraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;
