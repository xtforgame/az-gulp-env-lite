import gulp from 'gulp';
import mocha from 'gulp-mocha';
import yargs from 'yargs';

function addTasks(gulpConfig){
  let testConfig = gulpConfig.getSubmodule('test');

  let outputEnv = testConfig.getOutputDistEnv();
  let files = yargs.argv.files || (outputEnv.joinPathByKeys([]) + '/**/*.js');

  gulp.task(testConfig.addPrefix('test'), testConfig.addPrefix(['build']), function() {
    gulp.src(files, {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({ui: 'bdd'}))
        .once('error', (e) => {
          console.error('test error :', e);
        })
        // .once('end', () => {
        //     process.exit();
        // })
  });

}

const gulpModules = {addTasks};
export default gulpModules;
