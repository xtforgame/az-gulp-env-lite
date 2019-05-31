import gulp from 'gulp';
import path from 'path';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import { GulpConfig, EnvConfig } from '../gulp-config';

let ts : any;

function addBuildCommonLibraryDtsTask(serverConfig : GulpConfig, commonLibraryConfig : GulpConfig, envConfig : EnvConfig, commonLibraryOptions = {}){
  if (!ts) {
    ts = require('gulp-typescript');
  }

  gulp.task(serverConfig.addPrefix('build:common-dts' + envConfig.postfix), /*commonLibraryConfig.addPrefix([clean']),*/ () => {
    let tsconfig = commonLibraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    let tsOutputDir = envConfig.env.joinPathByKeys(['js']);
    let relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);

    const tsProject = ts.createProject(tsconfig, {
      allowJs: false,
      declaration: true,
    });
    const tsResult = tsProject.src()
    .pipe(tsProject());

    return tsResult.dts
    .pipe(gulp.dest(path.join(tsOutputDir, relativePath)));
  });
}

function addBuildCommonLibraryTasks(serverConfig : GulpConfig, commonLibraryConfig : GulpConfig, envConfig : EnvConfig, commonLibraryOptions = {}){
  // compile server side scripts
  gulp.task(serverConfig.addPrefix('build:common' + envConfig.postfix), () => {
    let jsSourceFiles = commonLibraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    let relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);

    let babelOptions = {
      //modules: 'amd',
      moduleIds: false,
      comments: false,
      compact: false,
      ...(<any>commonLibraryOptions).babel,
    };
    return gulp.src(jsSourceFiles)
      //.pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel(babelOptions))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(jsOutputDir, relativePath)));
  });
}

function addBuildServerDtsTask(serverConfig : GulpConfig, envConfig : EnvConfig){
  if (!ts) {
    ts = require('gulp-typescript');
  }

  gulp.task(serverConfig.addPrefix('build:dts' + envConfig.postfix), /*commonLibraryConfig.addPrefix([clean']),*/ () => {
    let tsconfig = serverConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    let tsOutputDir = envConfig.env.joinPathByKeys(['js']);

    const tsProject = ts.createProject(tsconfig, {
      allowJs: false,
      declaration: true,
    });
    const tsResult = tsProject.src()
    .pipe(tsProject());

    return tsResult.dts
    .pipe(gulp.dest(tsOutputDir));
  });
}

function addBuildTasks(serverConfig : GulpConfig, commonLibraryConfig : GulpConfig, envConfig : EnvConfig, serverOptions = {}, commonLibraryOptions = {}){
  let waitingTasks : Array<string> = [/*'clean'*/];
  let useCommonLibrary = serverConfig.get('useCommonLibrary');

  if(useCommonLibrary && commonLibraryConfig){
    let tsconfig = commonLibraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    if(tsconfig){
      addBuildCommonLibraryDtsTask(serverConfig, commonLibraryConfig, envConfig, commonLibraryOptions);
      waitingTasks.push('build:common-dts' + envConfig.postfix);
    }
    addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig, commonLibraryOptions);
    waitingTasks.push('build:common' + envConfig.postfix);
  }

  let tsconfig = serverConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
  if(tsconfig){
    addBuildServerDtsTask(serverConfig, envConfig);
    waitingTasks.push('build:dts' + envConfig.postfix);
  }

  waitingTasks = serverConfig.addPrefix(waitingTasks) as Array<string>;

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
        ...(<any>serverOptions).babel,
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(jsOutputDir));
  };
  (<any>mainFunc).displayName = serverConfig.addPrefix('build:<main>' + envConfig.postfix);

  if (waitingTasks.length > 0) {
    gulp.task(serverConfig.addPrefix('build' + envConfig.postfix), gulp.series(
      gulp.parallel(...waitingTasks),
      mainFunc
    ));
  } else {
    gulp.task(serverConfig.addPrefix('build' + envConfig.postfix), mainFunc);
  }

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

function addTasks(gulpConfig : GulpConfig){
  let serverConfig = <GulpConfig>gulpConfig.getSubmodule('server');
  let commonLibraryConfig = <GulpConfig>gulpConfig.getSubmodule('commonLibrary');
  let envConfigs = serverConfig.getEnvConfigsForDevDist();
  let serverOptionsList = serverConfig.getOptionsForDevDist() || [];
  let commonLibraryOptionsList = commonLibraryConfig.getOptionsForDevDist() || [];

  envConfigs.map((envConfig, i) => addBuildTasks(serverConfig, commonLibraryConfig, envConfig, serverOptionsList[i] || {}, commonLibraryOptionsList[i] || {}));
}

const gulpModules = {addTasks};
export default gulpModules;
