import gulp from 'gulp';
import path from 'path';
import {GulpConfig} from './gulp/gulp-config';
import serverTasks from './gulp/server';
import libraryTasks from './gulp/library';

const projRoot  = path.resolve(__dirname);
let config = {
  projRoot,
  base: projRoot,
  submodules: {
    commonLibrary: {
      prefix: 'common',
      entry: {
        dir: 'common',
        js: {
          dir: 'azcommon',
          glob: '**/*.js',
        },
      },
      output: {
        default: {
          js: {},
        },
      },
      options: {
        default: {
          babel: {},
        },
        //dev: {},
        //dist: {},
      },
    },
    server: {
      prefix: 'server',
      useCommonLibrary: {
        relativePath: 'azcommon',
      },
      entry: {
        dir: 'server',
        js: {
          glob: '**/*.js',
        },
      },
      output: {
        default: {
          dir: 'test-server',
          js: {
            filename: 'server.js',
          },
          // static: {
          //   test01: {
          //     dir: 'xtree'
          //   },
          //   test02: {
          //     dir: 'toastr',
          //   },
          // },
          // servedBase: '../',
        },
        //dev: {},
        //dist: {},
      },
      options: {
        default: {
          babel: {},
          nodemon: {
            ext: 'js,html',
          },
        },
        //dev: {},
        //dist: {},
      },
    },
    library: {
      prefix: 'library',
      entry: {
        dir: 'gulp',
        js: {
          glob: '**/*.js',
        },
      },
      output: {
        default: {
          dir: 'dist',
        },
        //dev: {},
        //dist: {},
      },
      options: {
        default: {
          babel: {},
        },
        //dev: {},
        //dist: {},
      },
    },
  },
};

let gulpConfig = new GulpConfig(config);

libraryTasks.addTasks(gulpConfig);
serverTasks.addTasks(gulpConfig);

let serverConfig = gulpConfig.getSubmodule('server');
gulp.task('watch', gulp.series(serverConfig.addPrefix('watch:dev')));

let libraryConfig = gulpConfig.getSubmodule('library');
gulp.task('build', gulp.series(libraryConfig.addPrefix('clean'), libraryConfig.addPrefix('build')));


gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
