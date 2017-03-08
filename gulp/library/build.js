import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

function addTasks(gulpConfig){
  let libraryConfig = gulpConfig.getSubmodule('library');

  //compile library scripts
  gulp.task(libraryConfig.addPrefix('build'), /*libraryConfig.addPrefix([clean']),*/ () => {
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

const gulpModules = {addTasks};
export default gulpModules;

