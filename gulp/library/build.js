import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

function addBuildTasks(libraryConfig, envConfig, libraryOptions = {}){
  //compile library scripts
  gulp.task(libraryConfig.addPrefix('build' + envConfig.postfix), /*libraryConfig.addPrefix([clean']),*/ () => {
    let jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let outputEnv = libraryConfig.getOutputDistEnv();
    let jsOutputDir = outputEnv.joinPathByKeys([]);

    return gulp.src(jsSourceFiles)
      //.pipe(plumber())
      //.pipe(sourcemaps.init())
      .pipe(babel({
        //modules: 'amd',
        moduleIds: false,
        comments: false,
        compact: false,
        ...libraryOptions.babel,
      }))
      //.pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(jsOutputDir))
      .once('error', (e) => {
        console.error('build error :', e);
      });
  });
}

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');
  let envConfigs = libraryConfig.getEnvConfigsForDevDist();
  let libraryOptionsList = libraryConfig.getOptionsForDevDist() || [];

  envConfigs.map((envConfig, i) => addBuildTasks(libraryConfig, envConfig, libraryOptionsList[i] || {}));
}

const gulpModules = {addTasks};
export default gulpModules;

