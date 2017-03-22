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
    },
    server: {
      prefix: 'server',
      useCommonLibrary: {
        relativePath: 'azcommon'
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
    },
  },
};

let gulpConfig = new GulpConfig(config);

serverTasks.addTasks(gulpConfig);
libraryTasks.addTasks(gulpConfig);

let serverConfig = gulpConfig.getSubmodule("server");
gulp.task('watch', serverConfig.addPrefix(['watch']));
gulp.task('build', serverConfig.addPrefix(['build']));

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
