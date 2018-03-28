import clean from './clean';
import build from './build';
import serve from './serve';
import watch from './watch';

var gulpModules = null;

export default  {
  childList: [
    'clean',
    'build',
    'serve',
    'watch',
  ],
  children: {
    clean,
    build,
    serve,
    watch,
  },
  addTasks(gulpConfig){
    this.childList.map(key => this.children[key].addTasks && this.children[key].addTasks(gulpConfig));
  },
};

