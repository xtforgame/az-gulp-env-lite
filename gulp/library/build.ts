import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import { GulpConfig, EnvConfig } from '../gulp-config';

let ts : any;

function addBuildDtsTask(libraryConfig : GulpConfig, envConfig : EnvConfig, libraryOptions = {}){
  if (!ts) {
    ts = require('gulp-typescript');
  }

  //compile library scripts
  gulp.task(libraryConfig.addPrefix('build:dts' + envConfig.postfix), /*libraryConfig.addPrefix([clean']),*/ () => {
    let tsconfig = libraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    let outputEnv = <GulpConfig>libraryConfig.getOutputDistEnv();
    let tsOutputDir = outputEnv.joinPathByKeys([]);

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

function addBuildTasks(libraryConfig : GulpConfig, envConfig : EnvConfig, libraryOptions = {}){
  let waitingTasks : Array<string> = [/*'clean'*/];
  let tsconfig = libraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
  if(tsconfig){
    addBuildDtsTask(libraryConfig, envConfig, libraryOptions);
    waitingTasks.push('build:dts' + envConfig.postfix);
  }

  waitingTasks = libraryConfig.addPrefix(waitingTasks) as Array<string>;

  let mainFunc = function () {
    let jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let outputEnv = <GulpConfig>libraryConfig.getOutputDistEnv();
    let jsOutputDir = outputEnv.joinPathByKeys([]);

    return gulp.src(jsSourceFiles)
      //.pipe(plumber())
      //.pipe(sourcemaps.init())
      .pipe(babel({
        //modules: 'amd',
        moduleIds: false,
        comments: false,
        compact: false,
        ...(<any>libraryOptions).babel,
      }))
      //.pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(jsOutputDir))
      .once('error', (e : Error) => {
        console.error('build error :', e);
      });
  };
  (<any>mainFunc).displayName = libraryConfig.addPrefix('build:<main>' + envConfig.postfix);

  //compile library scripts
  if (waitingTasks.length > 0) {
    gulp.task(libraryConfig.addPrefix('build' + envConfig.postfix), gulp.series(
      gulp.parallel(...waitingTasks),
      mainFunc
    ));
  } else {
    gulp.task(libraryConfig.addPrefix('build' + envConfig.postfix), mainFunc);
  }
}

function addTasks(gulpConfig : GulpConfig){
  let libraryConfig = <GulpConfig>gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();
  let libraryOptionsList = libraryConfig.getOptionsForDevDist() || [];

  envConfigs.map((envConfig, i) => addBuildTasks(libraryConfig, envConfig, libraryOptionsList[i] || {}));
}

const gulpModules = {addTasks};
export default gulpModules;

