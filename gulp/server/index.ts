import clean from './clean';
import build from './build';
import serve from './serve';
import watch from './watch';
import { GulpConfig, GulpModuleMap } from '../gulp-config';


const children : GulpModuleMap = {
  clean,
  build,
  serve,
  watch,
};

export default {
  childList: [
    'clean',
    'build',
    'serve',
    'watch',
  ],
  children: children,
  addTasks(gulpConfig : GulpConfig){
    this.childList.map(key => this.children[key].addTasks && this.children[key].addTasks(gulpConfig));
  },
};

