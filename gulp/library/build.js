import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

function addBuildTasks(libraryConfig, envConfig){
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
        /*
        'presets': ['es2015', 'react', 'stage-2'],
        'plugins': ['transform-decorators-legacy', 'transform-class-properties'],
        */
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

  envConfigs.map(envConfig => addBuildTasks(libraryConfig, envConfig));
}

const gulpModules = {addTasks};
export default gulpModules;

