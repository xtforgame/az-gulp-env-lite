import clean from './clean';
import build from './build';
import watch from './watch';

var gulpModules = null;

export default  {
  childList: [
    'clean',
    'build',
    'watch',
  ],
  children: {
    clean,
    build,
    watch,
  },
  addTasks(gulpConfig){
    this.childList.map(key => this.children[key].addTasks && this.children[key].addTasks(gulpConfig));
  },
};
