import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';

function addTasks(gulpConfig){
  let testConfig = gulpConfig.getSubmodule('test');

  //compile test scripts
  gulp.task(testConfig.addPrefix('build'), /*testConfig.addPrefix([clean']),*/ () => {
    let jsSourceFiles = testConfig.joinPathByKeys(['entry', 'js', 'glob']);
    let outputEnv = testConfig.getOutputDistEnv();
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

